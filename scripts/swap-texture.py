"""
Swap a texture inside a GLB file with an external image.

Usage:
  python scripts/swap-texture.py <glb_file> <texture_name> <replacement_image>

Example:
  python scripts/swap-texture.py public/examples/scene_optimized.glb Painting2_baseColor "public/examples/weinix poster.png"

Requirements:
  pip install pygltflib
"""

import sys
import os
import mimetypes
import pygltflib


def list_textures(glb):
    """Print all image textures in the GLB."""
    print("=== Images in GLB ===")
    for i, image in enumerate(glb.images):
        print(f"  [{i}] {image.name}  (mimeType={image.mimeType})")


def find_image_index(glb, name):
    """Find an image by name (substring match). Returns index or None."""
    for i, image in enumerate(glb.images):
        if image.name and name in image.name:
            return i
    return None


def get_mime_type(filepath):
    """Guess MIME type from file extension."""
    mime, _ = mimetypes.guess_type(filepath)
    return mime or "application/octet-stream"


def swap_texture(glb_path, texture_name, replacement_path):
    """Replace a named texture inside a GLB with an external image file."""

    if not os.path.isfile(glb_path):
        print(f"Error: GLB file not found: {glb_path}")
        sys.exit(1)
    if not os.path.isfile(replacement_path):
        print(f"Error: Replacement image not found: {replacement_path}")
        sys.exit(1)

    # Load GLB
    glb = pygltflib.GLTF2().load(glb_path)
    list_textures(glb)

    # Find target image
    target_idx = find_image_index(glb, texture_name)
    if target_idx is None:
        print(f"\nError: No image named '{texture_name}' found in the GLB.")
        print("Available image names are listed above.")
        sys.exit(1)

    target_image = glb.images[target_idx]
    print(f"\nTarget: [{target_idx}] {target_image.name}")

    # Read replacement image
    with open(replacement_path, "rb") as f:
        new_data = f.read()

    print(f"Replacement: {replacement_path} ({len(new_data)} bytes)")

    # Get binary blob and buffer view info
    blob = glb.binary_blob()
    bv = glb.bufferViews[target_image.bufferView]
    old_offset = bv.byteOffset
    old_length = bv.byteLength
    size_diff = len(new_data) - old_length

    print(f"Old texture size: {old_length} bytes → New: {len(new_data)} bytes (diff: {size_diff:+d})")

    # Splice new image data into the binary blob
    new_blob = blob[:old_offset] + new_data + blob[old_offset + old_length:]

    # Update buffer view length
    bv.byteLength = len(new_data)

    # Update mime type
    target_image.mimeType = get_mime_type(replacement_path)

    # Shift all subsequent buffer view offsets
    for other_bv in glb.bufferViews:
        if other_bv.byteOffset > old_offset:
            other_bv.byteOffset += size_diff

    # Update total buffer size
    glb.buffers[0].byteLength = len(new_blob)

    # Apply and save
    glb.set_binary_blob(new_blob)
    glb.save(glb_path)

    print(f"\nSaved: {glb_path}")
    print("Texture swap complete!")


if __name__ == "__main__":
    if len(sys.argv) == 1:
        # No args — just list textures in a default file for convenience
        print(__doc__)
        sys.exit(0)

    if len(sys.argv) != 4:
        print("Usage: python swap-texture.py <glb_file> <texture_name> <replacement_image>")
        sys.exit(1)

    swap_texture(sys.argv[1], sys.argv[2], sys.argv[3])
