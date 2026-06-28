# Classifier - Simple AI that reads tickets and decides:
# 1. Category (technical/billing/general/complaint/feature-request)
# 2. Priority (critical/high/medium/low)

# We use keyword matching - simple but works well!

# ============================================
# KEYWORDS for each CATEGORY
# ============================================
CATEGORY_KEYWORDS = {
    'technical': [
        'error', 'bug', 'crash', 'not working', 'broken', 'login',
        'password', 'install', 'install', 'slow', 'loading', 'connect',
        'server', 'database', 'api', 'website', 'app', 'mobile',
        'browser', 'sync', 'update', 'download', 'upload', 'glitch'
    ],
    'billing': [
        'payment', 'charge', 'invoice', 'bill', 'refund', 'money',
        'price', 'cost', 'subscription', 'plan', 'credit card',
        'paypal', 'transaction', 'fee', 'discount', 'coupon',
        'cancel subscription', 'upgrade', 'downgrade'
    ],
    'complaint': [
        'disappointed', 'angry', 'terrible', 'worst', 'horrible',
        'unhappy', 'unacceptable', 'rude', 'poor service', 'bad',
        'frustrated', 'complaint', 'awful', 'never again'
    ],
    'feature-request': [
        'add feature', 'suggestion', 'would be nice', 'please add',
        'request', 'new feature', 'improvement', 'idea', 'dark mode',
        'enhancement', 'would like', 'could you add'
    ],
    'general': [
        'how to', 'help', 'question', 'information', 'tutorial',
        'guide', 'learn', 'understand', 'explain'
    ]
}

# ============================================
# KEYWORDS for each PRIORITY
# ============================================
PRIORITY_KEYWORDS = {
    'critical': [
        'urgent', 'emergency', 'critical', 'asap', 'immediately',
        'system down', 'cannot work', 'production down', 'security breach',
        'hacked', 'data loss', 'everyone affected'
    ],
    'high': [
        'important', 'soon', 'quickly', 'serious', 'major',
        'cannot login', 'cannot access', 'blocking work', 'today'
    ],
    'low': [
        'whenever', 'no rush', 'minor', 'small', 'someday',
        'low priority', 'when possible', 'nice to have'
    ]
    # 'medium' is default if nothing matches
}


def classify_category(text):
    """Find which category matches most keywords"""
    text = text.lower()  # Convert to lowercase
    
    # Count matches for each category
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in text:
                score += 1
        scores[category] = score
    
    # Find category with highest score
    best_category = max(scores, key=scores.get)
    
    # If no keywords matched, return 'general'
    if scores[best_category] == 0:
        return 'general'
    
    return best_category


def classify_priority(text):
    """Find which priority matches keywords"""
    text = text.lower()
    
    # Check critical first (most important)
    for keyword in PRIORITY_KEYWORDS['critical']:
        if keyword in text:
            return 'critical'
    
    # Then high
    for keyword in PRIORITY_KEYWORDS['high']:
        if keyword in text:
            return 'high'
    
    # Then low
    for keyword in PRIORITY_KEYWORDS['low']:
        if keyword in text:
            return 'low'
    
    # Default is medium
    return 'medium'


def classify_ticket(title, description):
    """Main function - classify a ticket"""
    # Combine title and description
    full_text = f"{title} {description}"
    
    # Get category and priority
    category = classify_category(full_text)
    priority = classify_priority(full_text)
    
    return {
        'category': category,
        'priority': priority
    }


# Test the classifier (only runs if file is executed directly)
if __name__ == '__main__':
    print("Testing Classifier:\n")
    
    test_cases = [
        ("Cannot login", "Password reset not working"),
        ("Charged twice", "I see two payments on my credit card"),
        ("Add dark mode", "Please add dark mode feature"),
        ("URGENT: System down", "Nothing works, emergency!"),
        ("How to export data", "I need help to export my data")
    ]
    
    for title, desc in test_cases:
        result = classify_ticket(title, desc)
        print(f"Title: {title}")
        print(f"  Category: {result['category']}")
        print(f"  Priority: {result['priority']}\n")