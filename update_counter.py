import sqlite3
import json
import sys

def init_db():
    conn = sqlite3.connect('counters.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS counters
                 (id INTEGER PRIMARY KEY, name TEXT UNIQUE, count INTEGER)''')
    c.execute("INSERT OR IGNORE INTO counters (name, count) VALUES ('visits', 0)")
    c.execute("INSERT OR IGNORE INTO counters (name, count) VALUES ('clicks', 0)")
    conn.commit()
    conn.close()

def increment_counter(counter_name):
    conn = sqlite3.connect('counters.db')
    c = conn.cursor()
    c.execute("UPDATE counters SET count = count + 1 WHERE name = ?", (counter_name,))
    conn.commit()
    conn.close()

def get_counters():
    conn = sqlite3.connect('counters.db')
    c = conn.cursor()
    c.execute("SELECT name, count FROM counters")
    result = {row[0]: row[1] for row in c.fetchall()}
    conn.close()
    return result

def export_to_json():
    data = get_counters()
    with open('counters.json', 'w') as f:
        json.dump(data, f)

if __name__ == '__main__':
    init_db()
    
    if len(sys.argv) > 1:
        counter_name = sys.argv[1]
        increment_counter(counter_name)
    
    export_to_json()
    print("Counters updated successfully")
