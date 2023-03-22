Resize images in the browser before uploading them to the server. 

# Install
1. Check if you wouldn't rather use the `im` driver option, which might be able to handle large images
2. If not, download and copy folder into your `plugins` directory.

# Use
On a files section, set the `maxpixels` property. 

## Example

```yaml
my_image_section:
  type: files
  maxpixels: 2000000 #two million pixels
```

Now, when a user tries to upload a 9000x12000 pixel image, this image will be resized to 1224x1632, which are 1'997'568 pixels. 

# But why? 

PHP requests normally have limited resources.

Trying to resize a 9000x12000 pixels large image to 1224x1632 pixels, requires at least:
```math
(9000 \times 12000 + 1224 \times 1632) * 4bytes \approx 440\textit{MB} \textrm{ of RAM}
```

If your shared hosting provider limits your max RAM per request to 256MB, you won't be able to resize the image on your server using Kirby's GD Driver. 

⚠️ **As an alternative: the IM driver probably is, depending on server setup, able to handle big images. You might not need this plugin.**

# Known issues
 - On Microsoft Edge, resized images are renamed to "blob". (Both the release of Kirby 3.2 and the adoption of V8 in Edge should solve this issue). 
 - Files replaced from inside the File view will not be resized. (see issue [#2](https://github.com/rasteiner/k3-maxpixels-option/issues/2))
