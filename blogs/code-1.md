# Morse Code, Braille, Binary & The Nature of Codes

> **Book:** Code: The Hidden Language of Computer Hardware and Software
> **Author:** Charles Petzold

---

## Table of Contents

1. [Why this book starts with Morse Code instead of Computers](#1-why-doesnt-the-book-start-with-computers)
2. [The Central Idea of the Book](#2-the-central-idea-of-the-book)
3. [What is a Code?](#3-what-is-a-code)
4. [Flashlight Communication Story](#4-the-flashlight-story)
5. [Morse Code](#5-morse-code)
6. [Binary Thinking](#6-binary-thinking)
7. [Combinatorics (Powers of Two)](#7-combinatorics-powers-of-two)
8. [Morse Tree](#8-morse-tree)
9. [Louis Braille](#9-louis-braille)
10. [Braille System](#10-braille)
11. [Grade 2 Braille](#11-grade-2-braille)
12. [Shift Codes & Escape Codes](#12-shift-codes-escape-codes)
13. [Hidden Computer Science Lessons](#13-biggest-computer-science-lessons)
14. [Key Takeaways](#14-biggest-hidden-message-of-these-chapters)
15. [Memory Tricks](#15-memory-tricks)
16. [Revision Cheat Sheet](#16-final-revision-cheat-sheet)
17. [One Sentence Summary ✦](#17-one-sentence-summary)
18. [30 Important Questions & Answers + Concept Revision](#18-30-important-questions-answers-concept-revision)
19. [Interview Questions](#19-interview-questions)
20. [Common Mistakes Beginners Make](#20-common-mistakes-beginners-make)
21. [Memory Palace](#21-memory-palace)
22. [Ultimate Summary ✦](#22-ultimate-summary)
23. [One-Line Summary of Chapters 1–3](#23-one-line-summary-of-chapters-13)

---

# 1. Why doesn't the book start with computers?

Most computer books begin like this:

```text
CPU
RAM
SSD
Operating System
Programming
```

Petzold doesn't.

Instead he starts with

- Flashlights
- Morse Code
- Braille

Why?

Because he wants to teach **how information is represented**, not how computers look.

The biggest lesson of the book is:

> Computers are not magic machines.
> They are machines that transform one representation of information into another.

---

# 2. The Central Idea of the Book ✦

Everything you've read so far revolves around one sentence:

> **Information is different from its representation.**

For example:

The word

```text
CAT
```

can be represented as

```text
English

CAT
```

↓

```text
Morse

-.-. .- -
```

↓

```text
Braille

⠉ ⠁ ⠞
```

↓

```text
ASCII

67 65 84
```

↓

```text
Binary

01000011
01000001
01010100
```

↓

```text
Electrical Signals

HIGH LOW HIGH HIGH...
```

Notice something.

The **message never changed.**

Only the representation changed.

This is exactly what computers do.

---

# 3. What is a Code?

A code is simply

> A system for representing information.

Many people think

```text
Code = Secret
```

Not true.

Most codes are NOT secret.

Examples

| Code                  | Represents           |
| --------------------- | -------------------- |
| English               | Ideas                |
| Morse                 | Letters              |
| Braille               | Letters by touch     |
| Traffic Lights        | Driving Instructions |
| ASCII                 | Characters           |
| Binary                | Information          |
| Programming Languages | Instructions         |

Every code converts one form of information into another.

---

# 4. The Flashlight Story

Imagine

```text
You               Friend

🏠                🏠
🪟--------------🪟
```

Parents say:

> Go to sleep.

But you still want to talk.

No phone.

No internet.

Only flashlights.

Now you need a communication system.

---

## First Attempt

Draw letters in the air.

Example

```text
O

○
```

Didn't work.

Why?

Because movement is hard to recognize.

Lesson:

> Not every representation works well in every medium.

---

## Second Attempt

Blink counts.

```text
A = 1 blink

B = 2 blinks

...

Z = 26 blinks
```

Problem:

Sending

```text
HOW ARE YOU?
```

requires

```text
131 blinks
```

Too slow.

---

## Discovery

Morse Code

Now

```text
H = ....
```

instead of

```text
8 flashes
```

Much faster.

---

## Hidden Lesson

Good codes are

- Short
- Easy
- Efficient

---

# 5. Morse Code

Morse Code has only two symbols.

```text
.

Dot

-

Dash
```

Flashlight version

```text
Dot

Light ON briefly

Dash

Light ON longer
```

---

## Timing Rules

This is extremely important.

| Action              | Time    |
| ------------------- | ------- |
| Dot                 | 1 Unit  |
| Dash                | 3 Units |
| Gap inside letter   | 1 Unit  |
| Gap between letters | 3 Units |
| Gap between words   | 7 Units |

Easy trick

```text
1

↓

3

↓

7
```

Think

```text
Parts

Letters

Words
```

---

## SOS

```text
...

---

...
```

Actually sent as

```text
...---...
```

without letter gaps.

Reason

Easy to recognize during emergencies.

---

## Why Morse is Efficient

Your blinking system

```text
A = 1

Z = 26
```

Morse

```text
E

.
```

Most common letter

Only one symbol.

Rare letters get longer codes.

This is the same idea modern compression algorithms use.

---

# 6. Binary Thinking

The most important sentence so far:

> Two different things can represent everything.

Examples

```text
Dot

Dash
```

```text
Raised

Flat
```

```text
ON

OFF
```

```text
0

1
```

Everything in computers is eventually reduced to

```text
0

1
```

---

# 7. Combinatorics (Powers of Two)

Suppose every position has only

```text
2
```

choices.

How many combinations?

| Positions | Possibilities |
| --------- | ------------- |
| 1         | 2             |
| 2         | 4             |
| 3         | 8             |
| 4         | 16            |
| 5         | 32            |
| 6         | 64            |
| 7         | 128           |
| 8         | 256           |

Formula

```text
Possibilities = 2ⁿ
```

where

```text
n

=

Number of positions
```

---

## Example

Three switches

```text
000

001

010

011

100

101

110

111
```

Total

```text
8

=

2³
```

---

## Why This Matters

A computer bit also has

```text
2

choices

0

or

1
```

Everything in computing is built on this idea.

---

# 8. Morse Tree

Instead of memorizing

```text
A = .-

B = -...
```

Use a tree.

```text
                Start

             /          \

           .            -

          E              T

       /      \       /      \

      I        A     N        M

    /  \     /  \   /  \     /  \

   S    U   R   W D    K    G    O
```

Rule

```text
Left

=

Dot

Right

=

Dash
```

Example

Decode

```text
.-.
```

Start

↓

Dot

↓

Dash

↓

Dot

↓

R

No memorization needed.

---

# 9. Louis Braille

Louis Braille

- Born 1809
- Lost eyesight at age 3
- Entered blind school at age 10
- Invented Braille at age 15

Amazing achievement.

---

## Before Braille

Raised English letters.

Problem

Fingers are bad at recognizing complicated shapes.

Eyes love

```text
A
```

Fingers love

```text
●
```

Huge difference.

---

## Charles Barbier

Invented

```text
Night Writing
```

For soldiers.

Good idea

```text
Raised dots.
```

Bad idea

```text
Represented sounds.

Too complicated.
```

Louis Braille improved it.

---

## Engineering Lesson

Great inventions rarely appear from nothing.

Usually

```text
Good Idea

↓

Improve It

↓

Simplify It

↓

World Changes
```

---

# 10. Braille

Every character fits inside

```text
1 4

2 5

3 6
```

Each position

```text
Raised

or

Flat
```

Exactly

```text
2
```

choices.

Therefore

```text
2⁶

=

64
```

possible patterns.

---

## Pattern in Alphabet

Row 1

Uses

```text
1

2

4

5
```

only.

Row 2

Same patterns

+

Dot 3

Row 3

Same patterns

+

Dot 3

+

Dot 6

Beautiful design.

Not random.

---

# 11. Grade 2 Braille

Books became too large.

Solution

Use contractions.

Instead of

```text
T H E
```

One symbol.

Instead of

```text
A N D
```

One symbol.

Exactly like

```text
BTW

LOL

ASAP
```

in texting.

---

## Number Indicator

Braille doesn't invent new digits.

Instead

```text
Number Indicator
```

changes

```text
A

↓

1

B

↓

2

...

J

↓

0
```

Very clever.

---

## Capital Indicator

Instead of another alphabet

Braille simply says

```text
Next letter

=

Capital
```

Exactly like

```
Shift Key
```

on a keyboard.

---

# 12. Shift Codes & Escape Codes

## Shift Code

Changes interpretation until cancelled.

Example

```text
Number Indicator

A

B

C

Letter Indicator

D
```

Means

```text
123D
```

Everything after Number Indicator becomes numbers.

---

## Escape Code

Changes only ONE symbol.

Example

```text
Capital Indicator

a

b

c
```

Means

```text
Abc
```

Only first letter changes.

---

## Computer Equivalent

| Braille             | Keyboard      |
| ------------------- | ------------- |
| Capital Indicator   | Shift         |
| Number Indicator    | Caps Lock     |
| Letter Indicator    | Caps Lock OFF |

---

# 13. Biggest Computer Science Lessons

## Lesson 1

Information

≠

Representation

---

## Lesson 2

Binary systems are everywhere.

```text
ON/OFF

HIGH/LOW

1/0

Raised/Flat

Dot/Dash
```

---

## Lesson 3

Context matters.

Example

Binary

```text
01000001
```

Without context

Means

Nothing.

With ASCII

```text
A
```

With Integer

```
65
```

With Image

```text
Brightness Value
```

With CPU

```text
Machine Instruction
```

Same bits.

Different interpretation.

Exactly like Braille.

---

## Lesson 4

Good codes are optimized.

Morse

Short codes

↓

Common letters.

Braille

Patterns

↓

Easy for fingers.

Computers

Binary

↓

Easy for electronics.

---

# 14. Biggest Hidden Message of These Chapters

Petzold is NOT teaching

- Morse
- Braille

He is teaching

> **Representation Theory**

Every computer performs

```text
Idea

↓

Letters

↓

ASCII

↓

Binary

↓

Electric Signals

↓

CPU

↓

Binary

↓

ASCII

↓

Screen

↓

Idea
```

This is literally what happens every time you type on a keyboard.

---

# 15. Memory Tricks

## Morse

```text
E

.
```

Smallest letter.

---

```text
T

-
```

Tall letter

Long dash.

---

SOS

```text
...---...
```

Never forget.

---

Timing

```text
1

3

7
```

Parts

Letters

Words

---

## Braille

```text
6 Dots

↓

64 Patterns

↓

2⁶
```

---

## Binary

```text
Every extra bit

↓

Double possibilities.
```

---

## Shift Code

Think

```text
Caps Lock
```

## Escape Code

Think

```text
Shift Key
```

---

# 16. Final Revision Cheat Sheet

- [x] Code = Representation of Information
- [x] Morse = Dot + Dash
- [x] Braille = Raised + Flat
- [x] Computer = 0 + 1
- [x] Every Binary System follows `2ⁿ`
- [x] Information ≠ Representation
- [x] Context gives meaning.
- [x] Shift Codes change interpretation until cancelled.
- [x] Escape Codes change only one symbol.
- [x] Morse optimizes for communication speed.
- [x] Braille optimizes for touch.
- [x] Computers optimize for electronics.

---

# 17. One Sentence Summary ✦

> **The first three chapters of _Code_ are not really about Morse code or Braille—they are about teaching you that all information can be represented using simple binary choices, and that the meaning of those binary patterns depends entirely on the rules (the code) and the context in which they are interpreted. This single idea forms the foundation of all modern computing.**

---

# 18. 30 Important Questions & Answers + Concept Revision

---

### 1. What is a code?

<details>
<summary><b>Show Answer</b></summary>

A code is a **system for representing information**.

It converts information from one form into another.

Example

```text
Thought

↓

Speech

↓

Writing

↓

Morse

↓

Binary
```

The information never changes.

Only its representation changes.
</details>

---

### 2. Is every code secret?

<details>
<summary><b>Show Answer</b></summary>

No.

Most codes are **not secret**.

Examples

- English
- Braille
- Morse Code
- ASCII
- Unicode

These are public communication systems.

Only cryptographic codes are designed to hide information.
</details>

---

### 3. Why does Petzold begin the book with Morse Code instead of computers?

<details>
<summary><b>Show Answer</b></summary>

Because computers are built upon the same fundamental idea.

Before understanding computers we must understand

> Information Representation

Morse demonstrates

```text
Ideas

↓

Symbols

↓

Signals
```

Computers perform exactly the same process.
</details>

---

### 4. Why did drawing letters with a flashlight fail?

<details>
<summary><b>Show Answer</b></summary>

Because flashlights are poor at representing shapes.

Movement is difficult to interpret.

```text
Circle

↓

Hard to recognize
```

Instead

```text
Blink

Blink

Blink
```

is much easier.

Lesson

> Good codes must fit the medium.
</details>

---

### 5. Why was the counting-blink system inefficient?

<details>
<summary><b>Show Answer</b></summary>

Example

```text
A = 1 Blink

B = 2

...

Z = 26
```

Very long messages become exhausting.

Example

```text
HOW ARE YOU?

131 Blinks
```

Morse reduced this dramatically.
</details>

---

### 6. What are the two symbols in Morse Code?

<details>
<summary><b>Show Answer</b></summary>

```text
Dot (.)

Dash (-)
```

Flashlight version

```text
Short Flash

Long Flash
```

Everything is built using only these two symbols.
</details>

---

### 7. Why is Morse Code faster?

<details>
<summary><b>Show Answer</b></summary>

Common letters receive short codes.

Example

```text
E

.
```

One symbol only.

Rare letters receive longer codes.

This minimizes average transmission time.
</details>

---

### 8. What are the Morse timing rules?

<details>
<summary><b>Show Answer</b></summary>

| Action              | Units |
| ------------------- | ----- |
| Dot                 | 1     |
| Dash                | 3     |
| Gap inside letter   | 1     |
| Gap between letters | 3     |
| Gap between words   | 7     |

Memory Trick

```text
1

↓

3

↓

7
```
</details>

---

### 9. Why is SOS special?

<details>
<summary><b>Show Answer</b></summary>

SOS means

```text
...---...
```

It is sent continuously.

No letter gaps.

Reason

Easy to recognize during emergencies.
</details>

---

### 10. What is the Morse Tree?

<details>
<summary><b>Show Answer</b></summary>

Instead of memorizing codes alphabetically,

letters are arranged as a binary tree.

```text
                Start

             /          \

           .            -

          E              T

       /      \       /      \

      I        A     N        M

    /  \     /  \   /  \     /  \

   S    U   R   W D    K    G    O
```

Rule

```text
Left

=

Dot

Right

=

Dash
```

Example

Decode

```text
.-.
```

Start

↓

Dot

↓

Dash

↓

Dot

↓

R

No memorization needed.
</details>

---

### 11. Why is Morse Code considered binary?

<details>
<summary><b>Show Answer</b></summary>

Because every position has only two possibilities.

```text
Dot

or

Dash
```

Exactly like

```text
0

or

1
```
</details>

---

### 12. What is combinatorics?

<details>
<summary><b>Show Answer</b></summary>

Combinatorics studies

> How many combinations are possible?

Example

Three switches

```text
000

001

010

011

100

101

110

111
```

Total

```text
8

=

2³
```
</details>

---

### 13. Why do powers of two appear everywhere?

<details>
<summary><b>Show Answer</b></summary>

Because every binary position doubles possibilities.

Formula

```text
Possibilities = 2ⁿ
```

Examples

| Bits | Values |
| ---- | ------ |
| 1    | 2      |
| 2    | 4      |
| 3    | 8      |
| 4    | 16     |
| 8    | 256    |
| 16   | 65536  |
</details>

---

### 14. Why is adding one more bit so powerful?

<details>
<summary><b>Show Answer</b></summary>

Every new bit doubles possibilities.

```text
3 Bits

↓

8 Values

↓

Add one bit

↓

16 Values
```

One extra bit

↓

Double information.
</details>

---

### 15. Why is Binary ideal for computers?

<details>
<summary><b>Show Answer</b></summary>

Electronics naturally support two states.

```text
Voltage High

Voltage Low
```

Represented as

```text
1

0
```

Simple.

Reliable.

Fast.
</details>

---

### 16. Who was Louis Braille?

<details>
<summary><b>Show Answer</b></summary>

French inventor.

Lost eyesight at age 3.

Invented Braille at age 15.

Created the world's most successful tactile writing system.
</details>

---

### 17. Why didn't raised printed letters work well?

<details>
<summary><b>Show Answer</b></summary>

Eyes recognize shapes.

Fingers recognize patterns.

Complex shapes are slow to identify.

Dots are much easier.
</details>

---

### 18. What did Charles Barbier invent?

<details>
<summary><b>Show Answer</b></summary>

Night Writing.

Designed for soldiers.

Used raised dots.

Represented sounds instead of letters.

Good for short military messages.

Poor for books.
</details>

---

### 19. What did Louis Braille improve?

<details>
<summary><b>Show Answer</b></summary>

He kept

```text
Raised Dots
```

Removed

```text
Sound-based encoding
```

Introduced

```text
Letter-based encoding
```

Much simpler.
</details>

---

### 20. Why was Braille revolutionary?

<details>
<summary><b>Show Answer</b></summary>

Blind people could

- Read
- Write
- Take notes
- Study independently

Instead of only listening.
</details>

---

### 21. Why are there exactly 64 Braille patterns?

<details>
<summary><b>Show Answer</b></summary>

Braille contains

```text
6 Dots
```

Each dot has

```text
Raised

Flat
```

Two choices.

Therefore

```text
2⁶

=

64
```

No more.

No less.
</details>

---

### 22. Why is the Braille alphabet not random?

<details>
<summary><b>Show Answer</b></summary>

Rows are constructed systematically.

```text
Row 1

↓

Base Patterns

Row 2

↓

Base + Dot 3

Row 3

↓

Base + Dot 3 + Dot 6
```

Elegant design.
</details>

---

### 23. What is Grade 2 Braille?

<details>
<summary><b>Show Answer</b></summary>

An optimized version.

Uses contractions.

Example

```text
THE

↓

One Symbol
```

Advantages

- Smaller books
- Faster reading
</details>

---

### 24. Why reuse Braille symbols?

<details>
<summary><b>Show Answer</b></summary>

There are only

```text
64
```

patterns.

Instead of inventing more,

Braille changes meaning through context.

Exactly like programming languages.
</details>

---

### 25. What is a Shift Code?

<details>
<summary><b>Show Answer</b></summary>

A shift code changes interpretation

until cancelled.

Example

```text
Number Indicator

A

B

C

↓

123
```

Later

```text
Letter Indicator
```

returns to letters.
</details>

---

### 26. What is an Escape Code?

<details>
<summary><b>Show Answer</b></summary>

Escape affects

only the next symbol.

Example

```text
Capital Indicator

a

↓

A
```

The following letters remain unchanged.
</details>

---

### 27. Give a real-world example of Shift Code.

<details>
<summary><b>Show Answer</b></summary>

Caps Lock.

```text
ON

↓

Everything Uppercase
```

Until disabled.

Exactly like Braille Number Indicator.
</details>

---

### 28. Give a real-world example of Escape Code.

<details>
<summary><b>Show Answer</b></summary>

Keyboard Shift key.

```text
Shift + A

↓

A
```

Only one letter changes.

Exactly like Braille Capital Indicator.
</details>

---

### 29. What does this binary mean?

```text
01000001
```

<details>
<summary><b>Show Answer</b></summary>

Impossible to answer.

Meaning depends on context.

Could be

```text
ASCII

↓

A
```

or

```text
Integer

↓

65
```

or

```text
Pixel Brightness
```

or

```text
CPU Instruction
```

Bits themselves have no meaning.
</details>

---

### 30. What is the single most important lesson from Chapters 1–3?

<details>
<summary><b>Show Answer</b></summary>

> **Information is independent of its representation.**

Everything around us

```text
Speech

Writing

Morse

Braille

Binary

Electricity
```

represents exactly the same thing

using different codes.

Computers simply perform these translations extremely quickly.
</details>

---

# 19. Interview Questions

These are questions Petzold expects you to answer after reading these chapters.

---

### Explain why Morse Code is binary.

---

### Why are powers of two fundamental to computing?

---

### Difference between information and representation.

---

### Difference between Shift Code and Escape Code.

---

### Why are Braille patterns limited to 64?

---

### Why was Barbier's Night Writing unsuccessful?

---

### Why did Braille become successful?

---

### Why do computers use binary instead of decimal?

---

### Why is context important in binary interpretation?

---

### Explain why

```text
01000001
```

has multiple meanings.

---

# 20. Common Mistakes Beginners Make

- [ ] Thinking Binary itself has meaning.
  - **Truth:**
    ```text
    Binary

    ↓

    Needs Interpretation
    ```
- [ ] Thinking Morse invented Binary.
  - **Truth:** Morse only demonstrates binary thinking.
- [ ] Thinking Braille is random.
  - **Truth:** Braille is carefully engineered.
- [ ] Thinking Code means Secret.
  - **Truth:** Code simply means Representation.
- [ ] Thinking Computers understand English.
  - **Truth:** Computers understand electrical states.

---

# 21. Memory Palace

Imagine entering a building.

### Room 1
<details>
<summary>Explore Room 1</summary>

Flashlight

↓

Morse

↓

Communication
</details>

### Room 2
<details>
<summary>Explore Room 2</summary>

Coin

↓

Heads

Tails

↓

Binary
</details>

### Room 3
<details>
<summary>Explore Room 3</summary>

Tree

↓

Morse Tree

↓

Decoding
</details>

### Room 4
<details>
<summary>Explore Room 4</summary>

Blind Student

↓

Louis Braille

↓

Raised Dots
</details>

### Room 5
<details>
<summary>Explore Room 5</summary>

64 Switches

↓

2⁶

↓

Braille Patterns
</details>

### Room 6
<details>
<summary>Explore Room 6</summary>

Caps Lock

↓

Shift Code
</details>

### Room 7
<details>
<summary>Explore Room 7</summary>

Shift Key

↓

Escape Code
</details>

### Room 8
<details>
<summary>Explore Room 8</summary>

Computer Memory

↓

01000001

↓

Different Meanings
</details>

---

# 22. Ultimate Summary ✦

After Chapters 1–3, you should no longer think:

```text
Computers store letters.
```

Instead think

```text
Computers store binary patterns.

↓

Those patterns are interpreted using agreed-upon codes.

↓

Different interpretations produce letters, numbers, pictures,
sounds, videos, or machine instructions.

↓

Information never changes.

Only representation changes.
```

---

# 23. One-Line Summary of Chapters 1–3

> **The foundation of computer science is not programming or hardware—it is understanding how information can be represented, encoded, decoded, and interpreted using simple binary choices.**
