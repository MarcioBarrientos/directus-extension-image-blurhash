# directus-extension-image-blurhash
Creates a blurhash image using the library:
https://github.com/woltapp/blurhash

This script runs in `files_upload` hook

## Requirements
- A field named `blur_hash` (string) in the `directus_files` collection
- Have the `PUBLIC_URL` env variable set correctly