import os
import glob
import sys
from html.parser import HTMLParser

try:
    import pytest
    HAS_PYTEST = True
except ImportError:
    HAS_PYTEST = False

class StrictHTMLParser(HTMLParser):
    def __init__(self, filepath=""):
        super().__init__()
        self.filepath = filepath
        self.tags = []
        self.void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'}
        
    def handle_starttag(self, tag, attrs):
        if tag not in self.void_elements:
            self.tags.append(tag)
            
    def handle_endtag(self, tag):
        if tag in self.void_elements:
            return
        if not self.tags:
            msg = f"Closing tag </{tag}> found without matching opening tag in {self.filepath}."
            if HAS_PYTEST:
                pytest.fail(msg)
            else:
                print(f"FAIL: {msg}", file=sys.stderr)
                sys.exit(1)
        
        last_tag = self.tags.pop()
        if last_tag != tag:
            msg = f"Mismatched HTML tags in {self.filepath}: Expected </{last_tag}> but found </{tag}>."
            if HAS_PYTEST:
                pytest.fail(msg)
            else:
                print(f"FAIL: {msg}", file=sys.stderr)
                sys.exit(1)

def test_html_syntax_integrity():
    # Retrieve all HTML files from the repository
    base_dir = os.path.dirname(os.path.dirname(__file__))
    html_files = glob.glob(os.path.join(base_dir, "**/*.html"), recursive=True)
    
    # Assert that all HTML templates are structurally sound
    for file_path in html_files:
        if "node_modules" in file_path:
            continue
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        parser = StrictHTMLParser(os.path.basename(file_path))
        try:
            parser.feed(content)
            # If tags are left unclosed at EOF (ignoring void elements)
            if parser.tags:
                msg = f"Unclosed HTML tags in {os.path.basename(file_path)}: {parser.tags}"
                if HAS_PYTEST:
                    pytest.fail(msg)
                else:
                    print(f"FAIL: {msg}", file=sys.stderr)
                    sys.exit(1)
        except Exception as e:
            msg = f"HTML Parsing error in {os.path.basename(file_path)}: {e}"
            if HAS_PYTEST:
                pytest.fail(msg)
            else:
                print(f"FAIL: {msg}", file=sys.stderr)
                sys.exit(1)

if __name__ == "__main__":
    print("Running HTML structural syntax verification...")
    test_html_syntax_integrity()
    print("SUCCESS: All HTML files are structurally sound and syntactically valid!")

