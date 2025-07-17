#!/usr/bin/env python3
"""
Split large documentation files into manageable chunks for analysis.
"""

import os
import re
from pathlib import Path

def split_echoplex_manual(input_file, output_dir):
    """Split EchoplexPlusManual12.txt into 100-line chunks."""
    
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    # Split into 100-line chunks
    chunks = split_by_lines(lines, 100)
    for i, chunk in enumerate(chunks):
        output_file = output_dir / f"echoplex_manual_part{i+1:02d}.txt"
        write_chunk(output_file, ''.join(chunk))

def split_loopiv_guide(input_file, output_dir):
    """Split LoopIVGuide.xml into 100-line chunks."""
    
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    # Split into 100-line chunks
    chunks = split_by_lines(lines, 100)
    for i, chunk in enumerate(chunks):
        output_file = output_dir / f"loopiv_guide_part{i+1:02d}.xml"
        write_chunk(output_file, ''.join(chunk))

def split_schme_md(input_file, output_dir):
    """Split SCHme.md into 100-line chunks."""
    
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    # Split into 100-line chunks
    chunks = split_by_lines(lines, 100)
    for i, chunk in enumerate(chunks):
        output_file = output_dir / f"schme_part{i+1:02d}.md"
        write_chunk(output_file, ''.join(chunk))

def split_by_lines(lines, lines_per_chunk):
    """Split lines into chunks of specified size."""
    chunks = []
    for i in range(0, len(lines), lines_per_chunk):
        chunk = lines[i:i + lines_per_chunk]
        chunks.append(chunk)
    return chunks

def split_by_size(content, max_size):
    """Split content by size, trying to break at logical points."""
    chunks = []
    current_pos = 0
    
    while current_pos < len(content):
        end_pos = current_pos + max_size
        
        if end_pos >= len(content):
            chunks.append(content[current_pos:])
            break
        
        # Try to find a good break point (paragraph, sentence, or line)
        break_points = [
            content.rfind('\n\n', current_pos, end_pos),  # Paragraph break
            content.rfind('\n', current_pos, end_pos),    # Line break
            content.rfind('. ', current_pos, end_pos),    # Sentence break
            content.rfind(' ', current_pos, end_pos)      # Word break
        ]
        
        break_point = max(bp for bp in break_points if bp > current_pos)
        if break_point == -1:
            break_point = end_pos
        
        chunks.append(content[current_pos:break_point])
        current_pos = break_point
        
        # Skip whitespace at the beginning of next chunk
        while current_pos < len(content) and content[current_pos] in ' \n\t':
            current_pos += 1
    
    return chunks

def write_chunk(output_file, content):
    """Write content to output file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {output_file} ({len(content)} chars)")

def main():
    """Main function to split all documentation files."""
    
    docs_dir = Path(__file__).parent
    output_dir = docs_dir / "split_docs"
    output_dir.mkdir(exist_ok=True)
    
    files_to_split = [
        ("EchoplexPlusManual12.txt", split_echoplex_manual),
        ("LoopIVGuide.xml", split_loopiv_guide),
        ("SCHme.md", split_schme_md)
    ]
    
    for filename, split_func in files_to_split:
        input_file = docs_dir / filename
        if input_file.exists():
            print(f"\nSplitting {filename}...")
            split_func(input_file, output_dir)
        else:
            print(f"Warning: {filename} not found")
    
    print(f"\nAll files split into: {output_dir}")
    print("Split files:")
    for file in sorted(output_dir.glob("*")):
        size = file.stat().st_size
        print(f"  {file.name}: {size:,} bytes")

if __name__ == "__main__":
    main()