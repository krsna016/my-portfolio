# Web Security Foundations (Level -1 → Natas)
## Chapter 1 — First Principles of Computer Communication

> **Learning Philosophy**
>
> Do not memorize definitions.
> Understand **why** each concept had to exist. Every technology in networking and the Web was invented to solve a specific engineering problem.

---

# Knowledge Roadmap

```text
Human
    │
    ▼
Need to identify resources
    │
    ▼
Domain Names
    │
    ▼
Browser
    │
    ▼
DNS
    │
    ▼
IP Address
    │
    ▼
Communication
    │
    ▼
Medium
    │
    ▼
Signal
    │
    ▼
Bits
    │
    ▼
Encoding
    │
    ▼
Protocol
    │
    ▼
Layers (Abstraction)
```

---

# 1. Why Names Exist

## Problem

Humans need a way to refer to things.

Without names we cannot communicate efficiently.

Example:

- Professor
- Google
- India
- Laptop

Names are for humans.

---

## First Principle

> A **name** is a human-friendly identifier.

It is **not** the object itself.

Example:

```
Professor
```

is your name.

It is not you.

---

# 2. Domain Name

## Problem

Humans are poor at remembering long numeric identifiers.

Instead of remembering:

```
142.250.xxx.xxx
```

we remember:

```
google.com
```

---

## Definition

A **domain name** is a human-readable name people use to identify and access resources on the Web.

Examples

```
google.com
github.com
wikipedia.org
```

---

## Important

A domain name is **not**

- the website
- the server
- the IP address

It is a human-friendly identifier.

---

# 3. Why the Web Exists

## Engineering Problem

Suppose one person wants to share information with millions of people.

Sending individual copies would be inefficient.

---

## Solution

Store the information once.

Allow everyone to access it whenever needed.

---

## Purpose of the Web

- Publish information
- Share information
- Access information

efficiently.

---

# 4. Communication Requires a Path

Suppose two computers exist.

```
Computer A

Computer B
```

Can they communicate?

No.

Why?

Because information has no way to travel.

---

## First Principle

Information cannot travel by magic.

It always needs a path.

---

# 5. Requests Must Be Precise

Suppose a computer receives:

```
Send it.
```

Questions immediately appear:

Which file?

Where?

Which version?

---

## Engineering Principle

Computers do not guess.

Requests must be precise.

Ambiguous communication causes failure.

---

# 6. Client

## Definition

A client is

> the computer or program that initiates a request.

Examples

- Browser requesting a webpage
- Phone requesting weather
- Laptop requesting a PDF

---

## Important

Client is a **role**.

Not a type of computer.

Any computer may act as a client.

---

# 7. Server

## Definition

A server is

> the computer or program that receives requests and responds.

---

## Important

Server is also a role.

Not a kind of computer.

---

# 8. Browser

## First Principles

Humans cannot directly communicate with web systems.

They need an interface.

---

## Definition

A browser is

> a program that acts as the bridge between the user and the Web.

Examples

- Chrome
- Firefox
- Safari

---

## Important

Browser ≠ Client

More accurately,

The browser **performs the client role** on behalf of the user.

---

# 9. Network

## Problem

Two computers are not enough.

We need many computers communicating.

---

## Definition

A network is

> a group of connected devices capable of exchanging information.

---

## Important

Internet is a network.

Not every network is the Internet.

Examples

- Home network
- School network
- Office network

---

# 10. Address

## Problem

Suppose there are one billion computers.

How do we identify one specific computer?

---

## Solution

Every destination needs an address.

---

## Definition

An address uniquely identifies where communication should go.

---

# 11. IP Address

## Definition

An IP Address is

> a network address used to direct communication on an IP network.

---

## Important Observations

An IP address is NOT

- a name
- a domain name
- a hostname

Its purpose is routing communication.

---

## Multiple Addresses

A computer

may have

- one IP address
- multiple IP addresses

depending on its active network connections.

---

## No IP Address?

Yes.

A computer that is not participating in an IP network does not inherently require an IP address.

---

# 12. Hostname

Hostname

= human-readable name of a computer.

Examples

```
Office-PC

Professor-Laptop

Server-01
```

---

## Important

Hostname ≠ Domain Name

These are different concepts.

---

# 13. Why Domain Names Exist

Humans remember

```
google.com
```

more easily than

```
142.250.xxx.xxx
```

---

## Engineering Problem

Humans like names.

Computers need addresses.

Something must translate between them.

---

# 14. DNS

DNS

=

Domain Name System

---

## Engineering Problem

```
google.com
```

must somehow become

```
(IP Address)
```

---

## Definition

DNS is

> the system that translates domain names into IP addresses.

---

## DNS Responsibility

```
Domain Name
        ↓
IP Address
```

Only that.

DNS does NOT

- send webpages
- store webpages
- display webpages

---

# 15. Journey of Opening a Website

Conceptually

```
You

↓

Browser

↓

DNS

↓

IP Address

↓

Destination Computer

↓

Response

↓

Browser

↓

You
```

Order

1. Browser asks DNS
2. DNS returns IP
3. Browser contacts destination
4. Destination replies

---

# 16. Medium

## First Principle

Information cannot travel by itself.

It always requires a medium.

---

## Definition

A medium is

> something through which information travels.

Examples

- Copper cable
- Fiber optic cable
- Air (Wi-Fi)

---

## Important

The medium is NOT the information.

---

# 17. Signal

## Problem

Copper wires cannot understand

```
Hello
```

They only carry physical phenomena.

---

## Definition

A signal is

> the physical representation of information that travels through a medium.

Examples

Medium → Signal

Copper → Electrical signal

Fiber → Light pulses

Wi-Fi → Radio waves

---

# Important Rule

Information stays the same.

Signal changes according to the medium.

---

# 18. Bit

## Definition

A bit is

> the smallest unit of digital information.

Possible values

```
0

1
```

Only two.

---

## Why?

Electronics naturally distinguish two stable states.

Examples

ON / OFF

High voltage / Low voltage

---

## One Bit

One bit

=

2 possibilities.

Not enough to represent

```
Hello
```

---

# 19. Multiple Bits

More bits

↓

More possible combinations.

Examples

1 bit

```
2 possibilities
```

2 bits

```
4 possibilities
```

3 bits

```
8 possibilities
```

Each additional bit doubles the number of possible patterns.

---

# 20. Encoding

## Engineering Problem

Bits alone have no meaning.

Example

```
01000001
```

What is it?

A?

Z?

65?

Image?

Nobody knows.

---

## Definition

Encoding is

> an agreed set of rules assigning meaning to patterns of bits.

---

## Example

```
01000001

↓

A
```

---

## Important

Encoding is an agreement.

Without agreement,

communication fails.

---

# Encoding vs Protocol

Encoding answers

```
What does this data mean?
```

---

# 21. Protocol

## Engineering Problem

Even if two computers understand the bits,

how should they conduct the conversation?

Who starts?

Who replies?

When does communication end?

---

## Definition

A protocol is

> an agreed set of rules describing how two systems communicate.

---

## Examples of Questions Protocol Answers

- Who speaks first?
- How is a request made?
- How is a response sent?
- What happens if communication fails?

---

## Important

Protocol ≠ Encoding

Encoding

↓

Meaning

Protocol

↓

Conversation Rules

---

# 22. Abstraction

## Engineering Problem

Complex systems become impossible if every component knows everything.

---

## Definition

Abstraction

=

Hiding unnecessary complexity so each component focuses on its own responsibility.

---

## Example

Driving a car.

You press

```
Accelerator
```

You do not need to understand engine combustion.

---

# 23. Layers

Instead of one gigantic system,

engineers divide responsibilities.

Conceptually

```
Application

↓

Communication Rules

↓

Addressing

↓

Signals

↓

Medium
```

Each layer performs one responsibility.

---

## Benefits

- Simpler design
- Easier maintenance
- Independent improvements
- Better scalability
- Better security isolation

---

# Mental Models

## Names

Names identify things for humans.

---

## Addresses

Addresses direct communication.

---

## Browser

Browser is software.

It performs the client role.

---

## Client

Requests.

---

## Server

Responds.

---

## DNS

Name

↓

Address

---

## Medium

Carries signals.

---

## Signal

Carries encoded information physically.

---

## Bit

Smallest digital unit.

---

## Encoding

Gives bits meaning.

---

## Protocol

Defines communication rules.

---

## Layers

Separate responsibilities.

---

# Common Misconceptions

❌ Browser = Client

✔ Browser performs the client role.

---

❌ Internet = Network

✔ Internet is one network.

---

❌ Domain Name = IP Address

✔ Domain name is human-readable.

IP address directs communication.

---

❌ Hostname = Domain Name

✔ Different concepts.

---

❌ Signal = Information

✔ Signal is only the physical representation.

---

❌ Medium = Information

✔ Medium carries information.

---

❌ Encoding = Protocol

✔ Encoding defines meaning.

✔ Protocol defines conversation rules.

---

# Cybersecurity Connections

Understanding these concepts is essential because web security vulnerabilities often arise from:

- Incorrect protocol handling
- Encoding inconsistencies
- Improper request parsing
- DNS manipulation
- Incorrect assumptions about addressing
- Layer confusion

---

# Knowledge Tracker

## Concepts Learned

- Name
- Domain Name
- Web
- Request
- Client
- Server
- Browser
- Network
- Address
- IP Address
- Hostname
- DNS
- Medium
- Signal
- Bit
- Encoding
- Protocol
- Abstraction
- Layers

---

## First-Principles Rules

1. Information cannot travel without a medium.
2. Information travels as signals.
3. Signals represent bits.
4. Bits have no meaning until an encoding defines them.
5. Communication requires agreed protocols.
6. Names identify resources for humans.
7. Addresses identify destinations for communication.
8. Complex systems are built by separating responsibilities into layers.

---

# Where We Go Next

```text
✅ Medium
✅ Signal
✅ Bit
✅ Encoding
✅ Protocol
✅ Abstraction & Layers
⬜ Network (Under the Hood)
⬜ Internet
⬜ IP Network
⬜ IP Address (Deep Dive)
⬜ DHCP
⬜ DNS (Deep Dive)
⬜ HTTP
⬜ HTML
⬜ URLs
⬜ Cookies
⬜ Sessions
⬜ Authentication
⬜ Developer Tools
⬜ OverTheWire Natas
```