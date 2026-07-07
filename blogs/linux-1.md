# Linux & Ethical Hacking Foundations
## Complete Revision Notes (Bandit Levels 0–12)

---

# Part 1 — Core Terminology

---

# 1. Data

**Definition**

Data is information represented in a form that computers can store and process.

Examples

```
Hello
123
Photo
Video
Password
```

All of these eventually become binary.

---

# 2. Bit

A **bit** (Binary Digit) is the smallest unit of information.

Possible values

```
0
1
```

A computer ultimately understands only these two states.

---

# 3. Byte

A **byte** is a group of **8 bits**.

Example

```
01000001
```

represents

```
A
```

One byte can represent 256 different values.

---

# 4. Binary

Binary is the base-2 numbering system.

Example

```
01001000
01101001
```

can represent

```
Hi
```

---

# 5. File

A file is an organized sequence of bytes stored on persistent storage.

Examples

```
notes.txt
photo.jpg
movie.mp4
password.txt
```

Every file is fundamentally just bytes.

---

# 6. Human-readable

Data that humans can understand directly.

Example

```
Hello World
```

---

# 7. Binary File

A file whose bytes are intended for programs rather than direct human reading.

Examples

```
JPEG
PNG
Executable
Compressed archive
```

---

# 8. Metadata

Information **about** data.

Examples

- filename
- owner
- permissions
- size
- timestamps

Metadata is not the file contents.

---

# 9. File Extension

Examples

```
.txt
.jpg
.pdf
.gz
.tar
```

Important

Extensions are only **labels**.

They do **NOT** determine the actual file type.

---

# 10. Magic Number (File Signature)

Special bytes stored near the beginning of many file formats.

Programs like `file` inspect these bytes.

Example

```
PNG
89 50 4E 47
```

---

# 11. Encoding

Changing representation.

Information stays identical.

Example

```
HELLO

↓

SEVMTE8=
```

(Base64)

Purpose

- transport
- compatibility
- representation

NOT security.

---

# 12. Decoding

Reverse of encoding.

---

# 13. Compression

Store the same information using fewer bytes.

Goal

Reduce size.

---

# 14. Decompression

Recover the original bytes.

---

# 15. Lossless Compression

Recover every original byte exactly.

Examples

```
gzip
bzip2
xz
```

---

# 16. Archive

Packages multiple files into one container.

Example

```
tar
```

Archive ≠ Compression

---

# 17. Hexadecimal

Base-16 numbering system.

Digits

```
0-9
A-F
```

---

# 18. Hex Dump

Text representation of binary bytes.

Example

```
4A 6F 68 6E
```

---

# 19. Reconstruction

Recover binary from another representation.

Example

```
xxd -r
```

---

# 20. Stream

A flow of bytes.

Unlike files,

streams usually are **not stored**.

Examples

- keyboard input
- program output
- pipe

---

# 21. Pipe

Connects output of one program to another.

```
cat file.txt | grep hello
```

---

# 22. Standard Input (Preview)

Input stream received by a program.

Usually from

- keyboard
- another command

---

# 23. Substitution Cipher

Replace one character with another.

---

# 24. ROT13

Rotate alphabet by 13 characters.

Example

```
HELLO

↓

URYYB
```

Applying twice restores original.

---

# 25. Cipher

Algorithm that transforms information.

---

# 26. Working Copy

A duplicate used for experimentation.

Never modify original evidence.

---

# 27. Investigation Workflow

```
Observe

↓

Identify

↓

Choose Tool

↓

Transform

↓

Verify

↓

Repeat
```

This is one of the biggest lessons from Bandit.

---

# Part 2 — Linux Commands

---

# pwd

Meaning

Print Working Directory

Purpose

Show current directory.

Syntax

```bash
pwd
```

Example

```bash
pwd
```

Output

```
/home/bandit5
```

Use Cases

✅ Know where you are

✅ Before deleting files

✅ Before copying files

---

# ls

Purpose

List directory contents.

Syntax

```bash
ls
```

Examples

Basic

```bash
ls
```

Hidden files

```bash
ls -a
```

Detailed

```bash
ls -l
```

Human readable sizes

```bash
ls -lh
```

Use Cases

- inspect folders
- verify extraction
- verify copied files
- view permissions

---

# cd

Purpose

Change directory.

Examples

Current directory

```bash
cd .
```

Parent

```bash
cd ..
```

Home

```bash
cd
```

Specific

```bash
cd /tmp
```

Use Cases

- navigate filesystem
- enter working directory
- move into extracted folders

---

# cat

Meaning

Concatenate

Primary Uses

## 1. Display file

```bash
cat notes.txt
```

---

## 2. Concatenate files

```bash
cat file1 file2
```

---

## 3. Create file

```bash
cat > notes.txt
```

---

## 4. Append

```bash
cat file1 >> file2
```

---

## 5. Feed another command

```bash
cat file.txt | grep hello
```

---

## 6. Read passwords

```bash
cat password.txt
```

---

# file

Purpose

Identify actual file type.

Syntax

```bash
file filename
```

Examples

```bash
file image.txt
```

Output

```
JPEG image data
```

Use Cases

- identify malware
- identify archives
- verify compression
- verify renamed files
- digital forensics

---

# find

Purpose

Search filesystem using metadata.

General Syntax

```bash
find PATH CONDITIONS
```

Examples

Search by size

```bash
find . -size 33c
```

Search by owner

```bash
find / -user bandit7
```

Search by group

```bash
find / -group bandit6
```

Search executable

```bash
find . -executable
```

NOT executable

```bash
find . ! -executable
```

Search human readable

```bash
find . -readable
```

Common Uses

- find configs
- locate logs
- privilege escalation enumeration
- forensic searches

---

# grep

Meaning

Global Regular Expression Print

Purpose

Find matching lines.

Examples

Find word

```bash
grep password data.txt
```

Case insensitive

```bash
grep -i hello file.txt
```

Recursive

```bash
grep -r password .
```

Count matches

```bash
grep -c root passwd
```

Use Cases

- search logs
- search configs
- search passwords
- find API keys
- CTF flag discovery

---

# sort

Purpose

Sort text.

Example

```bash
sort names.txt
```

Reverse

```bash
sort -r
```

Numeric

```bash
sort -n
```

Use Cases

- prepare data
- remove duplicates
- combine with uniq

---

# uniq

Purpose

Handle duplicate adjacent lines.

Examples

Unique only

```bash
uniq -u
```

Count duplicates

```bash
uniq -c
```

Only repeated

```bash
uniq -d
```

Usually used as

```bash
sort file.txt | uniq
```

---

# strings

Purpose

Extract printable text from binary.

Example

```bash
strings executable
```

Pipeline

```bash
strings binary | grep password
```

Use Cases

- malware analysis
- reverse engineering
- CTF
- secrets discovery

---

# base64

Purpose

Encode or decode Base64.

Encode

```bash
base64 file.txt
```

Decode

```bash
base64 -d file.txt
```

Use Cases

- emails
- APIs
- JWT
- CTF
- data transport

---

# tr

Meaning

Translate

Purpose

Character-by-character translation.

Examples

Upper → Lower

```bash
tr 'A-Z' 'a-z'
```

ROT13

```bash
tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

Replace

```bash
tr 'ABC' 'XYZ'
```

Delete

```bash
tr -d '\r'
```

Squeeze repeats

```bash
tr -s ' '
```

Use Cases

- normalize text
- decode ROT13
- replace characters
- cleanup data

---

# cp

Meaning

Copy

Examples

Copy file

```bash
cp file1 file2
```

Copy to directory

```bash
cp file.txt /tmp
```

Recursive directory

```bash
cp -r folder backup
```

Use Cases

- create working copies
- backups
- forensic preservation

---

# mv

Purpose

Move or rename.

Rename

```bash
mv old.txt new.txt
```

Move

```bash
mv file.txt /tmp
```

Use Cases

- rename extensions
- organize files
- prepare archives

---

# mkdir

Purpose

Create directory.

Example

```bash
mkdir work
```

Parents

```bash
mkdir -p a/b/c
```

Use Cases

- labs
- projects
- temporary workspaces

---

# xxd

Purpose

Create hex dump.

Example

```bash
xxd binary
```

Reverse

```bash
xxd -r dump.txt output.bin
```

Use Cases

- binary inspection
- reverse engineering
- reconstruct files
- CTF

---

# gunzip

Purpose

Decompress gzip.

Example

```bash
gunzip archive.gz
```

Use Cases

- logs
- backups
- malware samples
- Bandit

---

# bunzip2

Purpose

Decompress bzip2.

Example

```bash
bunzip2 archive.bz2
```

Use Cases

- archives
- Linux packages
- forensic analysis

---

# tar

Meaning

Tape Archive

Extract

```bash
tar -xf archive.tar
```

Create

```bash
tar -cf archive.tar folder/
```

Create gzip archive

```bash
tar -czf backup.tar.gz folder/
```

Extract gzip archive

```bash
tar -xzf backup.tar.gz
```

List archive

```bash
tar -tf archive.tar
```

Use Cases

- software distribution
- backups
- log collection
- incident response
- malware analysis
- Linux package distribution

---

# Part 3 — Core Engineering Principles Learned

1. Never trust filenames.
2. Trust the bytes.
3. Verify with `file`.
4. Preserve original evidence.
5. Work on copies.
6. Every transformation creates a new state.
7. Observe → Verify → Act → Verify.
8. Unix tools do one job well.
9. Small commands become powerful when combined.
10. Think like an investigator, not a command memorizer.

---

# Progress Summary

You have completed and understood:

- Linux filesystem navigation
- File metadata
- Human-readable vs binary
- Permissions
- File identification
- Searching
- Text processing
- Streams and pipes
- Base64
- ROT13
- Hex dumps
- Compression
- Archives
- Investigation workflows
- Multi-layer forensic extraction

This foundation is exactly what later Bandit levels—and real-world Linux administration, digital forensics, and ethical hacking—will continue to build upon.