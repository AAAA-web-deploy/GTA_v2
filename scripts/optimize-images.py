from PIL import Image
from pathlib import Path
import io

root = Path('assets/images')


def save_webp(im, path, quality=78, method=6):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, 'WEBP', quality=quality, method=method)
    return path.stat().st_size


def report(label, before, after):
    print(f'{label}: {before/1024:.0f}KB -> {after/1024:.0f}KB ({100*(1-after/before):.0f}% smaller)')


logo = Image.open(root / 'logo-square.png').convert('RGBA')
before = (root / 'logo-square.png').stat().st_size
logo128 = logo.copy()
logo128.thumbnail((128, 128), Image.Resampling.LANCZOS)
after = save_webp(logo128, root / 'logo-square.webp', quality=82)
report('logo-square.webp', before, after)

logo48 = logo.copy()
logo48.thumbnail((48, 48), Image.Resampling.LANCZOS)
buf = io.BytesIO()
logo48.save(buf, 'PNG', optimize=True)
(root / 'favicon.png').write_bytes(buf.getvalue())
print(f'favicon.png: {buf.tell()/1024:.1f}KB')

wm = Image.open(root / 'grand-theft-anakin-vi.png').convert('RGBA')
before = (root / 'grand-theft-anakin-vi.png').stat().st_size
wm2 = wm.copy()
wm2.thumbnail((1160, 700), Image.Resampling.LANCZOS)
after = save_webp(wm2, root / 'grand-theft-anakin-vi.webp', quality=80)
report('grand-theft-anakin-vi.webp', before, after)

for name, max_w, q in [
    ('hero-desktop.webp', 1600, 72),
    ('hero-mobile.webp', 900, 72),
]:
    p = root / name
    im = Image.open(p).convert('RGB')
    before = p.stat().st_size
    im2 = im.copy()
    im2.thumbnail((max_w, max_w), Image.Resampling.LANCZOS)
    tmp = root / (name + '.tmp.webp')
    after = save_webp(im2, tmp, quality=q)
    if after < before * 0.95:
        tmp.replace(p)
        report(name, before, after)
    else:
        tmp.unlink(missing_ok=True)
        print(f'{name}: kept ({before/1024:.0f}KB)')

targets = [
    'map-galaxy-new.webp', 'map-leonida-new.webp', 'briefing-artifact.webp',
    'community-skyline.webp', 'route-heist-new.webp', 'route-war-new.webp', 'route-diplomacy-new.webp',
    '03-crew-anakin.webp', '04-crew-padme.webp', '05-crew-jason.webp', '06-crew-lucia.webp',
]
for name in targets:
    p = root / name
    if not p.exists():
        continue
    im = Image.open(p)
    before = p.stat().st_size
    mode = 'RGBA' if 'A' in im.getbands() else 'RGB'
    im = im.convert(mode)
    im2 = im.copy()
    max_w = 1400 if 'map' in name else (1100 if 'route' in name or 'crew' in name else 1000)
    im2.thumbnail((max_w, max_w), Image.Resampling.LANCZOS)
    tmp = root / (name + '.tmp.webp')
    save_im = im2.convert('RGB') if mode == 'RGB' else im2
    after = save_webp(save_im, tmp, quality=70)
    if after < before * 0.92:
        tmp.replace(p)
        report(name, before, after)
    else:
        tmp.unlink(missing_ok=True)
        print(f'{name}: kept ({before/1024:.0f}KB)')

# Destination / dialog art used on demand — shrink heavy ones
for p in sorted(root.glob('*.webp')) + sorted((root / 'locations').glob('*.webp')):
    if p.name.startswith('hero-') or p.name in {t for t in targets}:
        continue
    before = p.stat().st_size
    if before < 180 * 1024:
        continue
    im = Image.open(p).convert('RGB')
    im2 = im.copy()
    im2.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    tmp = p.with_suffix('.tmp.webp')
    after = save_webp(im2, tmp, quality=68)
    if after < before * 0.90:
        tmp.replace(p)
        report(str(p.relative_to(root)), before, after)
    else:
        tmp.unlink(missing_ok=True)

print('done')
