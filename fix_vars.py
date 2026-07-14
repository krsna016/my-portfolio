import re

css_file = 'assets/css/core/style.css'
with open(css_file, 'r') as f:
    css = f.read()

light_vars = '''#post-reader.reader-light {
    --theme-bg: #ffffff;
    --theme-text: #1a1a1a;
    --theme-hdr-bg: #f8f9fa;
    --theme-hdr-text: #333333;
    --theme-btn-bg: rgba(0, 0, 0, 0.05);
    --theme-btn-border: rgba(0, 0, 0, 0.1);
    --theme-btn-text: #333333;
    --theme-btn-hover-bg: rgba(0, 0, 0, 0.1);
    --theme-btn-hover-text: #000000;
    --theme-code-bg: #f0f0f0;
    --theme-code-text: #c7254e;
    --theme-heading-color: #111111;
    --theme-meta-text: #555555;
    --theme-hr: rgba(0, 0, 0, 0.1);
    --theme-body-text: #333333;
    --theme-list-text: #333333;
    --theme-strong-text: #000000;
    --theme-em-text: #2563eb;
    --theme-bq-border: #3b82f6;
    --theme-bq-bg: rgba(0, 0, 0, 0.02);
    --theme-bq-text: #444444;
    --theme-table-head-bg: #f1f5f9;
    --theme-table-head-text: #0f172a;
    --theme-table-row-alt: rgba(0, 0, 0, 0.02);
    --theme-table-border: rgba(0, 0, 0, 0.1);
    --theme-table-text: #333333;
    --theme-hr-line: rgba(0, 0, 0, 0.1);
    --theme-inline-code-bg: rgba(37, 99, 235, 0.1);
    --theme-inline-code-text: #2563eb;
    --theme-h1-bg: #f8f9fa;
    --theme-h1-text: #111111;
    --theme-h1-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    --theme-h2-bg: #f5f5f5;
    --theme-h2-text: #111111;
    --theme-h2-border: #3b82f6;
    --theme-h3-bg: #fafafa;
    --theme-h3-text: #444444;
    --theme-h3-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    --theme-h4-text: #d97706;
    --theme-link-color: #2563eb;
    --theme-link-hover-color: #1d4ed8;
}'''

frost_vars = '''#post-reader.reader-frost {
    --theme-bg: #f4f7f6;
    --theme-text: #2c3e50;
    --theme-hdr-bg: #ebf0f2;
    --theme-hdr-text: #34495e;
    --theme-btn-bg: rgba(44, 62, 80, 0.08);
    --theme-btn-border: rgba(44, 62, 80, 0.2);
    --theme-btn-text: #34495e;
    --theme-btn-hover-bg: rgba(44, 62, 80, 0.15);
    --theme-btn-hover-text: #2c3e50;
    --theme-code-bg: #e2e8e9;
    --theme-code-text: #e74c3c;
    --theme-heading-color: #2c3e50;
    --theme-meta-text: #7f8c8d;
    --theme-hr: rgba(44, 62, 80, 0.1);
    --theme-body-text: #34495e;
    --theme-list-text: #34495e;
    --theme-strong-text: #1a252f;
    --theme-em-text: #2980b9;
    --theme-bq-border: #3498db;
    --theme-bq-bg: rgba(44, 62, 80, 0.03);
    --theme-bq-text: #576574;
    --theme-table-head-bg: #e0e6ed;
    --theme-table-head-text: #1a252f;
    --theme-table-row-alt: rgba(44, 62, 80, 0.03);
    --theme-table-border: rgba(44, 62, 80, 0.1);
    --theme-table-text: #34495e;
    --theme-hr-line: rgba(44, 62, 80, 0.1);
    --theme-inline-code-bg: rgba(41, 128, 185, 0.1);
    --theme-inline-code-text: #2980b9;
    --theme-h1-bg: #eaeff0;
    --theme-h1-text: #2c3e50;
    --theme-h1-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    --theme-h2-bg: #eaeff0;
    --theme-h2-text: #2c3e50;
    --theme-h2-border: #3498db;
    --theme-h3-bg: #eff3f4;
    --theme-h3-text: #576574;
    --theme-h3-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    --theme-h4-text: #9b59b6;
    --theme-link-color: #2980b9;
    --theme-link-hover-color: #1a5276;
}'''

css = re.sub(r'#post-reader\.reader-light \{[^}]+\}', light_vars, css)
css = re.sub(r'#post-reader\.reader-frost \{[^}]+\}', frost_vars, css)

with open(css_file, 'w') as f:
    f.write(css)

print('Done')
