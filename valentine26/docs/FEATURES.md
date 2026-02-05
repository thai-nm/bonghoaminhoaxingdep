# FEATURES DOCUMENTATION

## 1. Dynamic "No" Button
- **Logic**: Moves to a random position on the screen when the mouse gets near it.
- **Goal**: Make it impossible (or very difficult) to select the "No" option.
- **Implementation**: Uses JavaScript event listeners to reposition the button container.

## 2. Growing "Yes" Button
- **Logic**: Every time it's clicked, its scale increases by a certain ratio.
- **Goal**: Emphasize that "Yes" is the only right answer and encourage the user to click it.

## 3. Success State
- **Logic**: Triggers when "Yes" is finally clicked.
- **Visuals**:
    - Confetti/heart particle animation.
    - Surprise GIF appears on screen.
    - "Congratulations!" message.
