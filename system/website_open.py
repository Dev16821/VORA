import subprocess
from memory.website_memory import load_websites


def open_website(name_or_url):
    predefined_links = {
        "whatsapp": "https://web.whatsapp.com",
        "gmail": "https://mail.google.com",
        "youtube": "https://www.youtube.com",
        "facebook": "https://www.facebook.com",
        "twitter": "https://www.twitter.com",
        "linkedin": "https://www.linkedin.com",
        "github": "https://www.github.com",
        "stackoverflow": "https://stackoverflow.com",
        "google": "https://www.google.com",
        "reddit": "https://www.reddit.com",
        "netflix": "https://www.netflix.com",
        "amazon": "https://www.amazon.com",
        "spotify": "https://www.spotify.com",
        "instagram": "https://www.instagram.com",
        "discord": "https://discord.com",
        "slack": "https://slack.com",
        "trello": "https://trello.com",
        "notion": "https://www.notion.so",
        "medium": "https://medium.com",
        "quora": "https://www.quora.com",
        "github": "https://www.github.com",
        "gitlab": "https://gitlab.com",
        "bitbucket": "https://bitbucket.org",
        "stackoverflow": "https://stackoverflow.com",
        "hacker news": "https://news.ycombinator.com",
        "product hunt": "https://www.producthunt.com",
        "dribbble": "https://dribbble.com",
        "behance": "https://www.behance.net",
        "codepen": "https://codepen.io",
        "jsfiddle": "https://jsfiddle.net",
        "code sandbox": "https://codesandbox.io",
        "replit": "https://replit.com",
        "glitch": "https://glitch.com",
        "codewars": "https://www.codewars.com",
        "leetcode": "https://leetcode.com",
        "hackerrank": "https://www.hackerrank.com",
        "codeforces": "https://codeforces.com",
        "atcoder": "https://atcoder.jp",
        "topcoder": "https://www.topcoder.com",
    }

    saved_websites = load_websites()
    key = name_or_url.lower().strip()

    if key in predefined_links:
        final_url = predefined_links[key]
    elif key in saved_websites:
        final_url = saved_websites[key]
    else:
        final_url = name_or_url.strip()

    try:
        subprocess.Popen(["xdg-open", final_url])
        print(f"Opened website: {final_url}")
    except Exception as e:
        print(f"Failed to open website: {e}")