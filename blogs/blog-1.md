# Container With Most Water — Complete Interview Learning Notes

## Problem Statement

Given an array `height[]`, where:

- `height[i]` represents the height of a vertical line at index `i`.
- Choose any two lines.
- These two lines together with the x-axis form a container.
- The container can hold water only up to the height of the shorter line.

Find the maximum amount of water that can be contained.

---

# Step 1: Understand the Area Formula

For any two indices:

```text
i < j
```

The container formed by them has:

```text
width = j - i
height = min(height[i], height[j])

area = width * height
```

or

```text
area = (j - i) * min(height[i], height[j])
```

---

## Important Clarification About Width

Many candidates get confused here.

Example:

```text
Index:  0 1 2 3 4 5
Height: 3 4 1 2 2 4
```

Choosing:

```text
i = 1
j = 5
```

Width is:

```text
5 - 1 = 4
```

NOT:

```text
number of elements in between = 3
```

Width means horizontal distance between the walls.

---

# Step 2: Discover the Brute Force Solution

## Thought Process

To guarantee finding the answer:

- Try every possible pair `(i, j)`
- Compute area
- Track maximum area

---

## Number of Pairs

For first index:

```text
(n-1) choices
```

For second:

```text
(n-2) choices
```

and so on.

Total:

```text
(n-1) + (n-2) + ... + 1

= n(n-1)/2
```

---

## Time Complexity

For each pair:

```text
width = j-i
height = min(...)
area = width * height
```

All are:

```text
O(1)
```

Therefore:

```text
Total Time = O(n²)
```

Space:

```text
O(1)
```

---

# Step 3: Search For Optimization

Instead of checking every pair, ask:

```text
Can we eliminate some pairs safely?
```

This is the key interview question.

---

# Step 4: The Core Insight

Suppose:

```text
left height = 3
right height = 8
```

Current area:

```text
width * min(3,8)

= width * 3
```

The shorter wall:

```text
3
```

is the bottleneck.

Water cannot rise above 3.

---

# Step 5: What Happens If We Move The Taller Wall?

Current:

```text
3 ........ 8
```

Move:

```text
8
```

inward.

Then:

### Width

Always decreases.

### Height

Cannot exceed:

```text
3
```

because the left wall is still 3.

So:

```text
newWidth < oldWidth
newHeight <= 3
```

Therefore:

```text
newArea <= oldArea
```

Important conclusion:

> Moving the taller wall can never help.

---

# Step 6: What Happens If We Move The Shorter Wall?

Current:

```text
3 ........ 8
```

Move:

```text
3
```

inward.

Now we might find:

```text
7 ........ 8
```

or

```text
10 ....... 8
```

The limiting height may increase.

This is our only chance to compensate for the reduced width.

Important conclusion:

> Always move the shorter wall.

---

# Step 7: The Elimination Argument

Suppose:

```text
left = 3
right = 8
```

Current area:

```text
width * 3
```

Now consider all future containers using the same left wall:

```text
(3,7)
(3,6)
(3,5)
...
```

For all of them:

### Width

Smaller.

### Height

At most:

```text
3
```

Therefore:

```text
area <= current area
```

None can be better.

Therefore:

> We can permanently discard the shorter wall.

This is the correctness proof.

---

# Step 8: Equal Heights Case

Suppose:

```text
5 ........ 5
```

Current area:

```text
width * 5
```

If we move left:

- Width decreases
- Limiting height ≤ 5

If we move right:

- Width decreases
- Limiting height ≤ 5

Both are safe.

Therefore:

> When heights are equal, move either pointer.

---

# Step 9: Why Start From Both Ends?

Initialize:

```text
left = 0
right = n-1
```

Why?

Because:

```text
width = right - left
```

This gives:

```text
maximum possible width
```

We start with the widest container and gradually reduce width while trying to increase height.

---

# Step 10: Complete Algorithm

Initialize:

```text
left = 0
right = n-1
maxArea = 0
```

While:

```text
left < right
```

do:

### 1. Compute width

```text
right - left
```

### 2. Compute height

```text
min(height[left], height[right])
```

### 3. Compute area

```text
width * height
```

### 4. Update answer

```text
maxArea = max(maxArea, area)
```

### 5. Move shorter pointer

If:

```text
height[left] < height[right]
```

move left.

Else if:

```text
height[right] < height[left]
```

move right.

Else:

```text
move either
```

Finally:

```text
return maxArea
```

---

# Step 11: Complexity Analysis

Initially:

```text
gap = n-1
```

Every iteration:

```text
gap decreases by exactly 1
```

Eventually:

```text
gap = 0
```

Therefore:

```text
iterations <= n-1
```

Time:

```text
O(n)
```

Space:

```text
O(1)
```

---

# Step 12: Why The Optimal Solution Is Never Missed

At each step:

We evaluate:

```text
(left,right)
```

Then discard the shorter wall.

Why?

Because every container involving that wall has:

- smaller width
- limiting height no larger than the current bottleneck

Therefore:

```text
none can beat current area
```

So we only discard pairs that are guaranteed not to be optimal.

Hence:

> The optimal answer can never be skipped.

---

# Step 13: Common Interview Question

## Why Move The Shorter Pointer?

Answer:

> The shorter wall determines the current container height. If we move the taller wall, width decreases while the limiting height cannot increase. Therefore area cannot improve. The only chance to find a larger area is to move the shorter wall and potentially discover a taller bottleneck.

---

# Step 14: Pattern Recognition

This problem belongs to:

```text
Two Pointers
```

Not:

```text
Sliding Window
```

because:

- No contiguous subarray
- We are optimizing a pair
- Pointers move according to a decision rule

Recognition clues:

- Array
- Need a pair
- Looking for max/min
- Left and right ends matter
- Can eliminate candidates safely

---

# Step 15: Can It Be Solved In O(log n)?

Generally:

```text
No
```

Reason:

- Array is unsorted
- No monotonic property
- Cannot discard half the search space at once
- Any index could participate in the optimal solution

Therefore:

```text
O(n)
```

is considered optimal.

---

# Step 16: How To Explain This Problem In An Interview

## 1. Start With The Brute Force Approach

Never jump directly to the optimal solution.

Say:

> My first thought is to check every possible pair of lines. For each pair, I can calculate the width as the distance between their indices and the height as the minimum of the two heights. The area is width multiplied by height. I would keep track of the maximum area across all pairs.

Complexity:

```text
Time  = O(n²)
Space = O(1)
```

Then say:

> Since O(n²) is expensive, I'll look for a way to eliminate unnecessary pairs.

---

## 2. Explain The Key Observation

Suppose:

```text
3 ........ 8
```

Say:

> The amount of water is limited by the shorter wall, which is 3. Even though the right wall is 8, the container can only hold water up to height 3.

Then continue:

> If I move the taller wall inward, the width decreases, but the limiting height cannot become larger than 3 because the shorter wall is still present. Therefore, moving the taller wall cannot produce a better result.

---

## 3. Explain Why We Move The Shorter Pointer

Say:

> The only chance to increase the area is to find a taller bottleneck. Therefore, I move the shorter wall inward and hope to find a taller wall that compensates for the reduction in width.

This is the most important sentence in the entire explanation.

---

## 4. Explain The Correctness Intuition

Suppose:

```text
left = 3
right = 8
```

Say:

> After evaluating this pair, every other pair that still uses the wall of height 3 will have a smaller width and a limiting height no greater than 3. Therefore none of those pairs can produce a larger area than the current one.

Then conclude:

> Because of that, I can safely discard the shorter wall and continue searching.

This is the correctness argument.

---

## 5. Explain The Algorithm

Say:

> I place one pointer at the beginning and one pointer at the end of the array because that gives me the maximum possible width.

Then:

> While the pointers have not crossed, I calculate the current area, update the maximum area, and move the pointer corresponding to the shorter wall.

Then:

> Eventually the pointers meet, and the maximum area found is the answer.

---

## 6. Explain The Complexity

Say:

> Initially the distance between the pointers is n−1. In every iteration, exactly one pointer moves, reducing the distance by one. Therefore there can be at most n−1 iterations.

Hence:

```text
Time  = O(n)
Space = O(1)
```

---

# Complete 60-Second Interview Answer

> I would first consider a brute-force solution where I evaluate every pair of lines and compute the area formed by them. That would take O(n²) time. To optimize, I observe that the water level is determined by the shorter wall. If I move the taller wall inward, the width decreases while the limiting height cannot increase, so the area cannot improve. Therefore, the only useful move is to advance the shorter wall. I start with two pointers at the ends of the array to maximize the initial width. In each iteration, I compute the area, update the answer, and move the shorter pointer inward. This works because once a shorter wall has been evaluated, any future container using that wall will have a smaller width and cannot produce a larger area. The algorithm runs in O(n) time and O(1) space.

---

# Interviewer's Follow-Up Questions

### Q1. Why move the shorter pointer?

Because the shorter wall is the bottleneck. Moving the taller wall decreases width without increasing the limiting height.

---

### Q2. Why not move both pointers?

Because doing so may skip valid candidate containers that have not yet been evaluated.

---

### Q3. What if both heights are equal?

Move either pointer. Both are bottlenecks, and discarding either is safe.

---

### Q4. Why does the algorithm not miss the optimal answer?

Because whenever we discard a shorter wall, we have already proven that every remaining pair involving that wall is worse than or equal to the current pair.

---

### Q5. Can we do better than O(n)?

Generally no. The array has no sorted or monotonic structure that allows us to eliminate half of the search space at a time, and every index may potentially participate in the optimal solution.

---

# Final Interview Summary

Brute Force:

```text
Time  = O(n²)
Space = O(1)
```

Optimal Two Pointer:

```text
Time  = O(n)
Space = O(1)
```

Golden Rule:

> Move the shorter wall because it is the bottleneck. Moving the taller wall cannot improve the answer.