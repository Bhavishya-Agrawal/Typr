export const snippets = {
    python: {
        words30: [
            `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
            `nums = [1, 2, 3, 4, 5]
squares = [n * n for n in nums if n % 2 == 0]
print(squares)`,
            `from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    active: bool = True`
        ],
        words50: [
            `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
            `def chunk(iterable, size):
    buf = []
    for item in iterable:
        buf.append(item)
        if len(buf) == size:
            yield buf
            buf = []
    if buf:
        yield buf`
        ],
        words100: [
            `class RateLimiter:
    def __init__(self, limit, window):
        self.limit = limit
        self.window = window
        self.calls = []

    def allow(self, ts):
        self.calls.append(ts)
        while self.calls and ts - self.calls[0] > self.window:
            self.calls.pop(0)
        return len(self.calls) <= self.limit`
        ]
    },

    javascript: {
        words30: [
            `const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Request failed");
    return res.json();
};`,
            `const delay = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));`,
            `const sum = nums => nums.reduce((a, b) => a + b, 0);`
        ],
        words50: [
            `function debounce(fn, wait) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}`,
            `const memo = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const value = fn(...args);
        cache.set(key, value);
        return value;
    };
};`
        ],
        words100: [
            `class EventBus {
    constructor() {
        this.listeners = new Map();
    }
    on(type, handler) {
        const list = this.listeners.get(type) ?? [];
        list.push(handler);
        this.listeners.set(type, list);
    }
    emit(type, payload) {
        const list = this.listeners.get(type) ?? [];
        for (const fn of list) fn(payload);
    }
    off(type, handler) {
        const list = this.listeners.get(type) ?? [];
        this.listeners.set(
            type,
            list.filter(fn => fn !== handler)
        );
    }
}`
        ]
    },

    java: {
        words30: [
            `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}`,
            `List<Integer> nums = List.of(1, 2, 3, 4);
int sum = nums.stream()
    .mapToInt(Integer::intValue)
    .sum();`,
            `record User(int id, String name, boolean active) {}`
        ],
        words50: [
            `public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
            `public <T> List<T> chunk(List<T> list, int size) {
    List<T> buf = new ArrayList<>();
    List<T> out = new ArrayList<>();
    for (T item : list) {
        buf.add(item);
        if (buf.size() == size) {
            out.addAll(buf);
            buf.clear();
        }
    }
    return out;
}`
        ],
        words100: [
            `public final class RateLimiter {
    private final int limit;
    private final long windowMs;
    private final Deque<Long> calls = new ArrayDeque<>();

    public RateLimiter(int limit, long windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
    }

    public synchronized boolean allow(long now) {
        calls.addLast(now);
        while (!calls.isEmpty() && now - calls.getFirst() > windowMs) {
            calls.removeFirst();
        }
        return calls.size() <= limit;
    }
}`
        ]
    },

    cpp: {
        words30: [
            `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
            `template <typename T>
T max_value(T a, T b) {
    return a > b ? a : b;
}`,
            `struct User {
    int id;
    string name;
    bool active = true;
};`
        ],
        words50: [
            `int binary_search(const vector<int>& a, int target) {
    int l = 0, r = (int)a.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (a[m] == target) return m;
        if (a[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
            `vector<vector<int>> chunk(const vector<int>& a, int size) {
    vector<vector<int>> out;
    vector<int> buf;
    for (int x : a) {
        buf.push_back(x);
        if ((int)buf.size() == size) {
            out.push_back(buf);
            buf.clear();
        }
    }
    if (!buf.empty()) out.push_back(buf);
    return out;
}`
        ],
        words100: [
            `class RateLimiter {
    int limit;
    long long window;
    deque<long long> calls;
public:
    RateLimiter(int limit, long long window)
        : limit(limit), window(window) {}

    bool allow(long long now) {
        calls.push_back(now);
        while (!calls.empty() && now - calls.front() > window) {
            calls.pop_front();
        }
        return (int)calls.size() <= limit;
    }
};`
        ]
    }
};
