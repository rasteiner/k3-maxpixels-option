;(function() {

  //polyfill canvas.toBlob
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {
        var canvas = this;
        setTimeout(function () {
          var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        });
      }
    });
  }

  //takes a file and a max pixel count and returns a promise that resolves to the resized file
  function resize(file, max) {
    return new Promise((resolve, reject) => {
      const img = new Image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      img.onload = () => {
        if (max < img.height * img.width) {
          const sq = Math.sqrt(img.width / img.height)
          const smax = Math.sqrt(max)
          canvas.width = sq * smax
          canvas.height = smax / sq
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          canvas.toBlob(result => {
            try {
              resolve(new File([result], file.name)) // Edge doesn't support the File constructor
            } catch(e) {
              // I just invent a "name" property for the blob.
              // Kirby should then manually set the filename on FormData
              result.name = file.name
              resolve(result)
            }
          }, file.type, 95)
        } else {
          resolve(file)
        }
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // register plugin
  panel.plugin('rasteiner/k3-maxpixels-option', {
    use: [
      function(Vue) {
        //get the default sections, so I can reuse stuff from there
        const originalUpload = Vue.options.components['k-upload'];
        const originalSection = Vue.options.components["k-files-section"];
        const originalField = Vue.options.components["k-files-field"];

        //new k-upload component
        const newUpload = {
          extends: originalUpload,
          data: function() {
            return {
              maxpixels: false
            }
          },
          methods: {
            upload: function(files) {
              if(this.maxpixels) {
                Promise.all([...files].map(file => {
                  if (file.type.startsWith('image/')) {
                    return resize(file, this.maxpixels)
                  } else {
                    return file
                  }
                })).then(files => {
                  originalUpload.options.methods.upload.call(this, files)
                });
              } else {
                originalUpload.options.methods.upload.call(this, files)
              }
            }
          }
        }

        // new files section component
        const newSection = {
          extends: originalSection,
          props: {
            maxpixels: {
              type: [Number, Boolean],
              default: false
            }
          },
          components: {
            'k-upload': newUpload //need to feed this in or Vue uses the original
          },
          updated: function() {
            this.$nextTick(() => {
              if(this.$refs.upload) {
                this.$refs.upload.maxpixels = this.maxpixels
              }
            })
          }
        }

        const newField = {
          extends: originalField,
          props: {
            maxpixels: {
              type: [Number, Boolean],
              default: false,
            },
          },
          components: {
            "k-upload": newUpload, //need to feed this in or Vue uses the original
          },
          mounted: function() {
            this.$nextTick(() => {

              if (this.$refs.fileUpload) {
                this.$refs.fileUpload.maxpixels = this.maxpixels;
              }
            })
          },
        };

        //register and overwrite the components
        Vue.component('k-upload', newUpload)
        Vue.component('k-files-section', newSection)
        Vue.component("k-files-field", newField)
      }
    ]
  })

})();
