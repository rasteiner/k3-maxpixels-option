Resize images in the browser before uploading them to the server. 

# Install
Download and copy folder into your `plugins` directory.

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

Servers have limited resources.

Trying to resize a 9000x12000 pixels large image to 1224x1632 pixels, requires at least:
```math
(9000 * 12000 + 1224 * 1632) * 4bytes ~= 440MB of RAM.
```

If your shared hosting provider limits your max RAM per request to 256MB, you won't ever be able to resize the image on your server. 

# Known issues
 - On Microsoft Edge, resized images are renamed to "blob". (Both the release of Kirby 3.2 and the adoption of V8 in Edge should solve this issue). 
 - Files replaced from inside the File view will not be resized. (see issue [#2](https://github.com/rasteiner/k3-maxpixels-option/issues/2))
