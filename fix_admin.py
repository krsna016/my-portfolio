import re

with open('admin.html', 'r') as f:
    content = f.read()

# 1. Add intense_pack.css
if 'intense_pack.css' not in content:
    content = content.replace(
        '<link rel="stylesheet" href="assets/css/style.css">',
        '<link rel="stylesheet" href="assets/css/style.css">\n    <link rel="stylesheet" href="assets/css/intense_features/intense_pack.css">'
    )

# 2. Add cyber_theme.css if it's missing in the head (it is currently at line 231, let's leave it or move it up)

# 3. Clean up CSS inside <style>
# Remove editor-panel background
content = re.sub(r'(\.editor-panel,\s*\.preview-panel\s*\{[^\}]+?)\s*background:[^;]+;\s*border:[^;]+;\s*border-radius:[^;]+;', r'\1', content)

# Remove form-group input styles
content = re.sub(r'\.form-group input,\s*\.form-group select\s*\{[^\}]+\}', '', content)

# Remove icon-grid background
content = re.sub(r'(\.icon-grid\s*\{[^\}]+?)\s*background:[^;]+;', r'\1', content)

# Remove cert-item background
content = re.sub(r'(\.cert-item\s*\{[^\}]+?)\s*background:[^;]+;\s*border:[^;]+;', r'\1', content)

# Remove login-box input styles
content = re.sub(r'\.login-box input\s*\{[^\}]+\}', '', content)

# Remove login-box background
content = re.sub(r'(\.login-box\s*\{[^\}]+?)\s*background:[^;]+;\s*border-radius:[^;]+;\s*border:[^;]+;', r'\1', content)

# 4. Inject .glass class to HTML elements
# instructions box
content = re.sub(r'style="background: rgba\(255, 255, 255, 0\.05\); border: 1px solid rgba\(255, 255, 255, 0\.1\); border-radius: 12px; padding: 1\.5rem; margin-bottom: 2rem;"',
                r'class="glass" style="padding: 1.5rem; margin-bottom: 2rem; border-radius: 12px;"', content)

# editor-panel
content = content.replace('class="editor-panel"', 'class="editor-panel glass"')

# preview-panel
content = content.replace('class="preview-panel"', 'class="preview-panel glass"')

# cert-item (added via JS mostly, but wait, the static HTML doesn't have them)
# login-box
content = content.replace('class="login-box"', 'class="login-box glass"')

with open('admin.html', 'w') as f:
    f.write(content)

print("admin.html updated successfully!")
