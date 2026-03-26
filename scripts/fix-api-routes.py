import os
import re

def update_api_routes(root_dir):
    api_dir = os.path.join(root_dir, 'app', 'api')
    if not os.path.exists(api_dir):
        print(f"Directory {api_dir} not found.")
        return

    # Regex to match 'export const dynamic = "..." or '...'' with optional semicolon and trailing newline
    dynamic_regex = re.compile(r'export\s+const\s+dynamic\s*=\s*["\'].*?["\'];?\s*\n?', re.MULTILINE)
    # Regex to check if generateStaticParams already exists
    static_params_regex = re.compile(r'export\s+(async\s+)?function\s+generateStaticParams', re.MULTILINE)

    for root, dirs, files in os.walk(api_dir):
        for name in files:
            if name == 'route.ts':
                file_path = os.path.join(root, name)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 1. Normalize dynamic declaration
                new_content = dynamic_regex.sub('', content)
                new_content = 'export const dynamic = "force-static";\n' + new_content
                
                # 2. Add generateStaticParams if the path is dynamic and it's missing
                if '[' in file_path and not static_params_regex.search(new_content):
                    new_content += '\n\nexport function generateStaticParams() {\n  return [];\n}\n'
                    print(f"Added generateStaticParams to {file_path}")
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Normalized {file_path}")

if __name__ == "__main__":
    update_api_routes(os.getcwd())
