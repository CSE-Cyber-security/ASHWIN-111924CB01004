import re
import getpass

def check_password_strength(password):
    """Return a strength label, score, and improvement tips."""
    checks = {
        "At least 8 characters": len(password) >= 8,
        "Uppercase letter (A-Z)": bool(re.search(r"[A-Z]", password)),
        "Lowercase letter (a-z)": bool(re.search(r"[a-z]", password)),
        "Number (0-9)": bool(re.search(r"\d", password)),
        "Special character (!@#$...)": bool(re.search(r"[^A-Za-z0-9]", password)),
    }

    score = sum(checks.values())

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Medium"
    else:
        strength = "Strong"

    tips = [name for name, passed in checks.items() if not passed]
    return strength, score, checks, tips


def main():
    print("=" * 42)
    print("       PASSWORD STRENGTH CHECKER")
    print("=" * 42)
    print("Your password is checked locally and is not saved.")
    password = getpass.getpass("\nEnter a password to check: ")

    strength, score, checks, tips = check_password_strength(password)

    print("\n--- CHECK RESULTS ---")
    for item, passed in checks.items():
        status = "PASS" if passed else "NEEDS WORK"
        print(f"{status:12} {item}")

    print(f"\nStrength: {strength} ({score}/5)")

    if tips:
        print("\nSuggestions:")
        for tip in tips:
            print(f"- Add/meet: {tip}")
    else:
        print("\nGreat! Your password meets all five basic checks.")

    print("\nTip: Use a unique passphrase and never reuse passwords.")


if __name__ == "__main__":
    main()
