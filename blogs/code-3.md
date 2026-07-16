# Code Notes #3 — Seeing Around Corners: How the Telegraph Changed the World

> **Book:** Code: The Hidden Language of Computer Hardware
and Software
> **Author:** Charles Petzold
>
> **Description:** Discover how a simple flashlight evolves into the world's first long-distance communication system, introducing telegraphs, shared circuits, grounding, and the engineering principles that eventually led to computers.

---

# Introduction

Up to this point in *Code*, we have learned that computers are not mysterious machines—they are built upon surprisingly simple ideas.

We started with communication using Morse code and Braille.

Then we learned that electricity is simply the movement of electrons.

Next we discovered that switches create binary states (ON and OFF), forming the basis of digital systems.

Now Charles Petzold asks a new question:

> **What if two people want to communicate, but they can't see each other anymore?**

This seemingly simple problem becomes the birth of modern telecommunications.

---

# The New Problem

Imagine you and your best friend have been communicating using flashlights.

```
You  <──────────────►  Friend
```

Everything works perfectly because both bedroom windows face each other.

One day your friend moves.

Now the houses are side by side.

```
You

↓

House

       House

        ↑

Friend
```

The windows face the same direction.

The flashlight beam can no longer reach your friend.

Communication has become impossible.

Or has it?

---

# Thinking Beyond Light

The flashlight itself isn't magical.

What actually matters is this:

```
Switch

↓

Light Turns ON

↓

Friend Sees It
```

The light simply represents information.

So instead of sending light through the air,

why not send electricity through a wire?

---

# The First Electrical Telegraph

Suppose we place:

- Battery
- Switch

inside your room.

But place the light bulb inside your friend's room.

```
Your House

Battery

↓

Switch

↓

================== Wire ==================

↓

Friend's Bulb

↓

Battery
```

Now something amazing happens.

Whenever you press your switch,

your friend's bulb lights.

The blink appears instantly.

You have recreated the flashlight,

except the light now travels through electricity instead of through air.

---

# Morse Code Still Works

Notice something important.

Nothing about Morse code changes.

The alphabet is still:

```
A = .-

B = -...

SOS = ...---...
```

The only thing that changes is **how the signal travels.**

Previously:

```
Switch

↓

Flashlight

↓

Air

↓

Friend
```

Now:

```
Switch

↓

Electricity

↓

Wire

↓

Bulb

↓

Friend
```

The information remains exactly the same.

Only the transmission medium changes.

---

# This is the Birth of the Telegraph

Without realizing it,

you have just recreated one of humanity's greatest inventions.

The electric telegraph.

Instead of using light directly,

information is converted into electrical pulses,

sent through wires,

and converted back into light (or later, sound).

This simple idea would eventually connect entire continents.

---

# Communication Requires a Complete Circuit

One of the biggest lessons from the previous chapter returns.

Electricity never travels halfway.

It always requires a complete loop.

```
Battery

↓

Switch

↓

Wire

↓

Bulb

↓

Wire

↓

Battery
```

Without a return path,

current stops.

No current means no information.

---

# One-Way Communication

At first,

only you own the switch.

```
You

Switch

↓

Wire

↓

Friend's Bulb
```

You can send messages.

Your friend cannot reply.

This is called **simplex communication**.

Examples:

- Television
- Radio
- Newspaper

Information flows only one way.

---

# Two-Way Communication

To allow replies,

your friend builds the exact same circuit.

```
You  ─────────► Friend

Friend ───────► You
```

Now both people can:

- Send
- Receive

This is called **bidirectional communication**.

Modern examples include:

- Telephone
- Internet
- Bluetooth
- Wi-Fi
- USB

Almost every modern communication system works this way.

---

# Two Independent Circuits

At first glance,

the system appears to contain one large network.

It actually consists of two completely independent electrical loops.

Loop 1:

```
Your Battery

↓

Friend's Bulb

↓

Back to Your Battery
```

Loop 2:

```
Friend's Battery

↓

Your Bulb

↓

Back to Friend's Battery
```

These loops never interfere with each other.

This independence is extremely important.

If both people press their switches simultaneously,

both messages can still be transmitted.

---

# Why Not Use Fewer Wires?

Originally,

each communication channel required two wires.

```
You → Friend

2 Wires

Friend → You

2 Wires

Total = 4 Wires
```

Copper wire is expensive.

Can we reduce the amount of wire?

The answer is yes.

---

# The Common Wire

Engineers realized something interesting.

Both circuits require a return path.

Instead of giving each circuit its own return wire,

both circuits can safely share one.

```
Signal Wire A

Signal Wire B

Shared Return Wire
```

The number of wires becomes:

```
3 instead of 4
```

A 25% reduction.

This shared return conductor is called the **common**.

---

# Why Doesn't the Shared Wire Cause Problems?

This is where many beginners become confused.

The answer lies in understanding loops.

Current from Battery A always returns to Battery A.

Current from Battery B always returns to Battery B.

Although both loops share the same physical conductor,

they remain electrically independent.

The wire is shared.

The circuits are not.

---

# The Engineering Principle

This introduces one of the most powerful ideas in engineering.

Different systems can safely share physical infrastructure,

provided each system maintains its own independent operation.

This concept appears everywhere:

- Internet cables
- Electrical grids
- USB devices
- Computer buses
- Ethernet networks

Sharing resources reduces cost without sacrificing functionality.

---

# Final Thoughts (Part 1)

At first,

Petzold appears to be telling a story about two children sending Morse code.

In reality,

he has introduced:

- Electrical communication
- Telegraph systems
- Bidirectional communication
- Shared electrical conductors
- Resource optimization

These ideas form the bridge between electricity and computer engineering.

The next part explores an even more fascinating question:

> **Can we replace an entire wire with the Earth itself?**

# Code Notes #3 — Seeing Around Corners (Part 2)

> **Series:** Reading *Code* by Charles Petzold
>
> **Part:** 3 (Part 2)
>
> **Topics Covered:** Earth Ground, Common vs Ground, Voltage Reference, Wire Resistance, AWG, Long-Distance Telegraphs, High Voltage Transmission, and the Birth of the Relay.

---

# Can We Reduce the Wires Even More?

In Part 1, we reduced the wiring from **4 wires** to **3 wires** by introducing a **common return wire**.

```
Signal Wire A

Signal Wire B

Shared Common
```

Engineers immediately asked another question:

> **Can we eliminate one more wire?**

Surprisingly,

the answer is **yes.**

---

# The Biggest Wire on Earth

Instead of using another copper wire,

why not use something much bigger?

Something that already connects every house.

That "wire" is...

```
The Earth.
```

The ground beneath our feet becomes part of the electrical circuit.

---

# Earth as a Conductor

Normally we imagine electricity flowing through copper.

```
Battery

↓

Copper Wire

↓

Bulb

↓

Copper Wire

↓

Battery
```

Now imagine replacing one wire with Earth.

```
Battery

↓

Copper Wire

↓

Bulb

↓

Ground Rod

↓

Earth

↓

Ground Rod

↓

Battery
```

The Earth now completes the electrical circuit.

This reduced the required wiring from **2 wires** to **1 wire** for a one-way telegraph.

---

# But Isn't Dirt a Bad Conductor?

Yes.

Compared to copper,

soil conducts electricity poorly.

Approximate conductivity:

```
Silver

★★★★★

Copper

★★★★☆

Aluminum

★★★☆☆

Wet Soil

★☆☆☆☆

Dry Sand

Almost None
```

So why does Earth still work?

---

# Size Matters

Electrical resistance depends on two major things:

- Material
- Cross-sectional area

Earth is not a great material,

but it is unimaginably large.

Imagine comparing:

```
Copper Wire

Diameter:

2 mm
```

to

```
Earth

Diameter:

≈12,742 km
```

Earth provides billions of possible paths for current.

Its enormous size compensates for its poor conductivity.

---

# Why a Long Copper Rod?

You cannot simply place a tiny nail into the ground.

That creates poor electrical contact.

Instead,

engineers use long copper rods.

Typically:

```
Length:

≈8 feet

Diameter:

≈0.5 inch
```

These rods create a very large contact area with moist soil,

dramatically reducing contact resistance.

---

# Ground vs Common

This is one of the most misunderstood concepts in electronics.

## Common

A common is simply a point shared by multiple circuits.

```
Battery (-)

──────────────
```

No physical connection to Earth is required.

Computers use commons everywhere.

---

## Ground

Ground means a physical electrical connection to Earth.

```
Battery

↓

Copper Rod

↓

Earth
```

Ground is literally the planet beneath your feet.

---

# Why Do Engineers Use the Same Symbol?

Circuit diagrams usually use this symbol:

```
     |
    ───
   ─────
  ───────
```

It simply means:

```
Ground Connection
```

Instead of drawing

- Earth
- Dirt
- Copper rods

every time.

---

# Earth Is an Ocean of Electrons

This is one of Petzold's best analogies.

Imagine throwing one bucket of water into the ocean.

Can you later identify those exact water molecules?

Of course not.

The ocean already contains enormous amounts of water.

Earth behaves similarly.

It contains an enormous number of electrons.

Instead of thinking:

```
My electron travels

200 miles
```

Think:

```
The Earth already contains electrons everywhere.

The electric field causes nearby charges to rearrange,

allowing current to flow.
```

---

# Why Don't Electrons Get Lost?

An obvious question arises.

Millions of circuits use Earth.

How do electrons know where to go?

They don't.

Electrons have no map.

They simply respond to electric fields created by voltage differences.

Current follows the electric field,

not a predefined destination.

---

# Why Doesn't This Work with Flashlight Batteries?

Suppose:

```
Battery

3V
```

Earth resistance might be

```
100Ω
```

Current becomes:

```
I = V / R

= 3 / 100

= 0.03A
```

That current is too small to light a flashlight bulb.

---

Now imagine

```
120V
```

Current becomes

```
120 / 100

=

1.2A
```

Much larger.

Now the Earth becomes a practical return conductor.

---

# Voltage Source Instead of Battery

Petzold gradually stops drawing batteries.

Instead he writes:

```
 V
 │
 │
Circuit
 │
Ground
```

The letter **V** simply means:

```
Voltage Source
```

It could be:

- Battery
- Generator
- Power Supply
- Any source of voltage

The important concept is the **voltage**, not the device producing it.

---

# Ground is 0 Volts

Voltage is always measured relative to something.

Engineers choose Earth.

```
Earth

=

0 Volts
```

Everything else is measured relative to Earth.

Example:

```
Battery +

=

+3V
```

means

```
3 volts above Earth.
```

---

# The Circuit Is Still a Loop

At first glance,

ground appears to break the circuit.

Actually,

it remains a complete loop.

```
Voltage Source

↓

Wire

↓

Bulb

↓

Earth

↓

Voltage Source
```

Electricity always requires a closed path.

Nothing about that rule changes.

---

# A Two-Way Telegraph Using Only Two Wires

By combining:

- Shared ground
- Two signal wires

Engineers reduced the connection between two stations to:

```
Signal Wire A

Signal Wire B
```

Earth performs the return path.

This was a revolutionary cost reduction.

---

# The Problem with Long Wires

Copper is an excellent conductor,

but not a perfect one.

Every wire has resistance.

Longer wire means:

```
More Resistance
```

More resistance means:

```
Less Current
```

Less current means:

```
Dimmer Bulb
```

Eventually,

the signal disappears completely.

---

# Wire Gauge (AWG)

Wire thickness is measured using:

```
American Wire Gauge

(AWG)
```

The surprising rule is:

```
Smaller Number

=

Thicker Wire
```

Example:

```
10 AWG

↓

Thicker
```

```
20 AWG

↓

Thinner
```

Thicker wire has:

- Lower resistance
- Lower energy loss
- Higher current capacity

---

# Example

20 AWG

Approximately

```
10Ω

per

1000 feet
```

Suppose you stretch one mile of wire.

The resistance becomes more than

```
100Ω
```

Now imagine using a flashlight battery.

```
3V

↓

100Ω
```

Current becomes

```
0.03A
```

Almost no light remains.

---

# Two Engineering Solutions

## Solution 1

Use thicker wire.

```
Lower Resistance

↓

More Current
```

Unfortunately,

thicker copper is expensive.

---

## Solution 2

Increase Voltage.

Suppose you need

```
100 Watts
```

At

```
10V
```

Current becomes

```
10A
```

At

```
100V
```

Current becomes

```
1A
```

Lower current dramatically reduces transmission losses.

This same principle powers today's electrical grid.

---

# The Telegraph Hits a Wall

By the mid-1800s,

telegraph systems expanded rapidly.

Cities became connected.

States became connected.

Countries became connected.

But eventually,

physics won.

Signals weakened after a few hundred miles.

The bulbs (or clicking sounders) became too weak to detect.

America could not be connected from coast to coast using simple wires alone.

A new invention became necessary.

---

# The Device That Changed Everything

Petzold ends the chapter with an intriguing statement:

> *"The solution... turns out to be a simple and humble device, but one from which entire computers can be built."*

That device is the **electromagnetic relay**.

A relay receives a weak electrical signal,

then uses that signal to operate a completely new switch,

creating a fresh, strong signal.

Instead of trying to send one weak signal thousands of miles,

telegraph stations regenerated it every few hundred miles.

This invention solved long-distance communication.

Even more importantly,

engineers later discovered that relays could do something astonishing:

```
Make Decisions.
```

Relays could implement:

- AND
- OR
- NOT

logical operations.

Those logic operations eventually became:

```
Logic Gates

↓

Arithmetic

↓

Memory

↓

Processors

↓

Computers
```

---

# Chapter Summary

This chapter quietly introduces some of the most important engineering concepts ever developed.

We learned:

- Communication does not require direct line of sight.
- Electricity can carry information through wires.
- Multiple circuits can safely share infrastructure.
- Earth can replace an entire return wire.
- Ground and Common are different concepts.
- Earth serves as the reference point for voltage.
- Long wires introduce resistance and weaken signals.
- Increasing voltage reduces transmission losses.
- Long-distance communication eventually requires signal regeneration.
- The humble relay becomes the next stepping stone toward the digital computer.

---

# Final Thoughts

At first,

this chapter seems to describe two children exchanging Morse code.

In reality,

Charles Petzold has explained the birth of modern communication engineering.

Every email,

every phone call,

every web page,

and every message you send today

rests upon the same ideas first explored in these simple telegraph circuits.

The journey from **flashlights** to **computers** is not a leap.

It is a carefully connected chain of engineering ideas,

each solving one problem and naturally leading to the next.

The relay is the next link in that chain.

# 30 Detailed Questions & Answers

---

# 1. Why does Petzold begin this chapter with the story of two friends instead of introducing the telegraph directly?

### Answer

Petzold uses a real-life problem to demonstrate why communication technology evolves.

Initially, two children communicate using flashlights because they have a direct line of sight.

When one friend moves, the communication method fails.

This forces us to think like an engineer:

> "How can we send information when direct sight is impossible?"

The telegraph was invented to solve exactly this type of problem.

Instead of memorizing what a telegraph is, we naturally discover **why it was needed**.

---

# 2. What is the fundamental difference between communication using a flashlight and communication using wires?

### Answer

The information itself does **not** change.

Only the transmission medium changes.

Flashlight communication:

```
Switch
↓
Light
↓
Air
↓
Eyes
```

Telegraph communication:

```
Switch
↓
Electricity
↓
Wire
↓
Bulb
↓
Eyes
```

In both systems, Morse code is identical.

Only the path carrying the information changes.

---

# 3. Why is electricity a better communication medium than light in this situation?

### Answer

Light travels only in straight lines.

Electricity follows the path created by conductors.

Therefore electricity can

- travel around corners
- travel underground
- travel through walls
- travel hundreds or thousands of kilometers

This removes the biggest limitation of flashlight communication.

---

# 4. Why must every telegraph circuit still be a complete loop?

### Answer

Electric current cannot simply leave a battery and stop somewhere.

Every electron that leaves the negative terminal must eventually return to the positive terminal.

Therefore every working circuit requires

```
Battery
↓

Wire
↓

Load

↓

Return Path

↓

Battery
```

Without the return path,

current immediately becomes zero.

---

# 5. Why does one switch control a bulb located far away?

### Answer

Closing the switch completes the electrical circuit.

Current instantly begins flowing through the entire loop.

The bulb receives current,

heats its filament,

and produces light.

The switch is not "sending light."

It is simply allowing current to flow.

---

# 6. Why are two separate circuits required for two-way communication?

### Answer

One circuit only allows

```
You

↓

Friend
```

Your friend has no way to reply.

Adding another independent circuit creates

```
You

↔

Friend
```

Each person now has

- Battery
- Switch
- Bulb

allowing both transmission and reception.

---

# 7. Why can both people send messages at the same time without interference?

### Answer

Because each battery powers only its own circuit.

Each loop is independent.

Battery A current returns only to Battery A.

Battery B current returns only to Battery B.

Although some wires are shared,

the electrical loops remain separate.

---

# 8. What is a "common" in an electrical circuit?

### Answer

A common is simply a conductor shared by multiple circuits.

It is not necessarily connected to Earth.

Example:

```
Circuit A

↓

Common

↓

Circuit B
```

Both circuits use the same conductor,

but remain electrically independent.

---

# 9. Why does using a common reduce wiring costs?

### Answer

Originally:

```
Circuit 1

2 wires

Circuit 2

2 wires

Total

4 wires
```

By sharing the return path,

```
Signal A

Signal B

Shared Return

=

3 wires
```

This saves

```
25%

of the wire.
```

For long telegraph lines,

this represented enormous savings.

---

# 10. Why doesn't current become confused inside the common wire?

### Answer

Electric current does not choose random paths.

It always follows complete electrical loops created by voltage sources.

Battery A current completes Battery A's loop.

Battery B current completes Battery B's loop.

Sharing one conductor does not merge the two circuits.

---

# 11. Why aren't the batteries connected in series when both switches are ON?

### Answer

Series connection requires the same current to pass through both batteries.

In this circuit,

Battery A's current never passes through Battery B.

Each battery powers only its own loop.

Therefore,

their voltages never add.

---

# 12. Why aren't the batteries connected in parallel either?

### Answer

Parallel batteries require

Positive terminals connected together

AND

Negative terminals connected together.

Here,

only the negative side is common.

The positive terminals remain isolated through separate switches and bulbs.

Therefore,

they are not parallel.

---

# 13. What engineering principle does the shared common introduce?

### Answer

It introduces

**resource sharing.**

Different systems can safely share infrastructure

without losing independence.

Modern examples include

- Internet cables
- USB ground
- Computer buses
- Ethernet
- Power distribution

---

# 14. Why can the Earth replace an entire wire?

### Answer

Earth is a gigantic conductor.

Although its conductivity is poor compared to copper,

its enormous size provides countless conductive paths.

Instead of installing another copper wire,

engineers simply connected both circuits to Earth.

Earth became the return conductor.

---

# 15. Why isn't Earth considered a good conductor?

### Answer

Because soil has much higher resistance than copper.

Copper:

Very low resistance.

Earth:

Much higher resistance.

However,

Earth compensates through its massive size.

---

# 16. Why do engineers use long copper rods instead of simply inserting a nail into the ground?

### Answer

Electrical contact depends on surface area.

Tiny contact

↓

High resistance.

Large copper rod

↓

Large contact area.

↓

Lower resistance.

↓

Better current flow.

---

# 17. Explain the difference between Ground and Common.

### Answer

Common:

Shared electrical reference inside a circuit.

Ground:

Physical electrical connection to Earth.

A common may never touch Earth.

A ground always does.

---

# 18. Why is Earth called zero volts?

### Answer

Voltage is always measured relative to another point.

Engineers choose Earth as the universal reference.

Therefore,

```
Earth

=

0 Volts
```

Every other voltage is measured relative to Earth.

---

# 19. Why does Petzold replace the battery symbol with the letter V?

### Answer

Because the important concept is

**voltage**,

not batteries.

The voltage source could be

- Battery
- Generator
- Power supply

The circuit analysis remains identical.

---

# 20. Why is the circuit still a closed loop after replacing one wire with Earth?

### Answer

Although the wire disappears,

Earth itself completes the path.

```
Battery

↓

Wire

↓

Bulb

↓

Earth

↓

Battery
```

The loop remains complete.

---

# 21. Why doesn't Earth-based communication work with flashlight batteries?

### Answer

Flashlight batteries provide only

```
3 Volts.
```

Earth resistance is too large.

The resulting current becomes too small to light the bulb.

Higher voltage systems overcome this problem.

---

# 22. Why do long wires weaken telegraph signals?

### Answer

Longer wires have greater resistance.

Greater resistance reduces current.

Lower current means

- dimmer bulbs
- weaker electromagnets
- weaker signals

Eventually,

communication becomes impossible.

---

# 23. What is American Wire Gauge (AWG)?

### Answer

AWG measures wire thickness.

Counterintuitively,

smaller AWG numbers represent thicker wires.

Example:

```
10 AWG

↓

Thicker

↓

Lower Resistance
```

```
20 AWG

↓

Thinner

↓

Higher Resistance
```

---

# 24. Why do thicker wires reduce energy loss?

### Answer

Thicker wires contain greater cross-sectional area.

More electrons can move simultaneously.

Collisions decrease.

Resistance decreases.

Less electrical energy becomes heat.

---

# 25. Why does increasing voltage help long-distance communication?

### Answer

Power equals

```
P = V × I
```

For the same power,

higher voltage requires lower current.

Lower current dramatically reduces wire losses because

```
Power Loss

=

I²R
```

---

# 26. Why couldn't early telegraph systems simply use infinitely long wires?

### Answer

Every additional kilometer increased resistance.

Eventually,

almost all voltage was lost across the wire itself.

The receiving device no longer received enough current to operate.

---

# 27. Why was saving one wire economically important?

### Answer

Imagine constructing

1000 km

of telegraph line.

Removing one conductor saves

1000 km of copper.

The financial savings become enormous.

Engineering often focuses on reducing cost while preserving functionality.

---

# 28. What major engineering problem remained unsolved at the end of this chapter?

### Answer

Long-distance signal weakening.

No matter how thick the wire,

or how high the voltage,

signals eventually became too weak.

This required a method of

**signal regeneration.**

---

# 29. What invention solved the long-distance telegraph problem?

### Answer

The electromagnetic relay.

A relay receives a weak signal,

then uses that weak signal to control a new electrical circuit,

creating a fresh, strong signal.

Telegraph stations placed relays every few hundred miles.

---

# 30. Why is this chapter considered one of the foundations of computer science?

### Answer

Because it introduces nearly every idea modern computers rely upon:

- Binary communication
- Electrical signaling
- Closed circuits
- Shared infrastructure
- Voltage reference
- Grounding
- Signal transmission
- Signal degradation
- Signal regeneration

Most importantly,

it naturally leads to the **relay**,

which becomes the first practical electrical switch capable of implementing logic.

Relays eventually become:

```
Relay

↓

Logic Gate

↓

Binary Arithmetic

↓

Memory

↓

Processor

↓

Computer
```

---

# Quick Revision Cheat Sheet

| Concept | Key Idea |
|----------|----------|
| Telegraph | Electricity carries information |
| Closed Circuit | Current always needs a complete loop |
| Bidirectional Communication | Two independent communication channels |
| Common | Shared return conductor |
| Ground | Physical connection to Earth |
| Earth | Massive return conductor |
| Voltage | Electrical potential difference |
| Wire Resistance | Increases with length |
| AWG | Smaller number = Thicker wire |
| High Voltage | Lower current for same power |
| Long Distance Problem | Signal weakens due to resistance |
| Relay | Regenerates weak electrical signals |
| Biggest Lesson | Modern computers evolved from solving communication problems, not from inventing calculations first. |