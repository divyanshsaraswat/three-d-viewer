import fitz
from PIL import Image
import io
import os

# Calculate paths relative to the project root
script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(script_dir)
pdf_dir = os.path.join(root_dir, 'public/brochures')
output_dir = os.path.join(root_dir, 'public/textures/brochures_webp')

os.makedirs(output_dir, exist_ok=True)

for file in os.listdir(pdf_dir):
    if not file.endswith('.pdf'): continue
    
    pack_name = file.replace('.pdf', '').replace('-Weinix', '').lower()
    print(f"Processing {file} ({pack_name})")
    
    doc = fitz.open(os.path.join(pdf_dir, file))
    for i in range(len(doc)):
        page = doc.load_page(i)
        
        # Render at 200 DPI for high quality
        pix = page.get_pixmap(dpi=200)
        img = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
        
        # Resize to max width 1200
        if img.width > 1200:
            ratio = 1200 / img.width
            new_height = int(img.height * ratio)
            img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
        
        target_path = os.path.join(output_dir, f'{pack_name}_page_{i+1}.webp')
        
        quality = 90
        while quality > 20:
            img.save(target_path, 'WEBP', quality=quality)
            size = os.path.getsize(target_path)
            # Increased limit to 250KB for smooth, non-jaggy textures
            if size <= 250000:
                break
            
            if size > 500000:
                quality -= 15
            elif size > 350000:
                quality -= 10
            else:
                quality -= 5
                
        print(f'Saved {target_path} (Size: {os.path.getsize(target_path)/1024:.1f} KB, Q: {quality})')
