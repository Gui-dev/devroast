import { describe, expect, it } from 'vitest'
import { detectLanguage } from './detect-language'

describe('detectLanguage', () => {
  describe('Python detection', () => {
    it('detects python by def keyword', () => {
      const code = `def foo():
    pass`
      expect(detectLanguage(code)).toBe('python')
    })

    it('detects python by class declaration', () => {
      const code = `class Foo:
    def __init__(self):
        pass`
      expect(detectLanguage(code)).toBe('python')
    })

    it('detects python by print statement', () => {
      const code = `print("Hello, World!")`
      expect(detectLanguage(code)).toBe('python')
    })

    it('detects python by import statement', () => {
      const code = `import os
import sys`
      expect(detectLanguage(code)).toBe('python')
    })

    it('detects python by self keyword', () => {
      const code = `class Foo:
    def bar(self):
        self.value = 10`
      expect(detectLanguage(code)).toBe('python')
    })

    it('detects python by raise statement', () => {
      const code = `raise ValueError("Invalid input")`
      expect(detectLanguage(code)).toBe('python')
    })

    it('detects python by elif', () => {
      const code = `if x > 0:
    pass
elif x < 0:
    pass`
      expect(detectLanguage(code)).toBe('python')
    })
  })

  describe('Java detection', () => {
    it('detects java by System.out', () => {
      const code = `System.out.println("Hello");`
      expect(detectLanguage(code)).toBe('java')
    })

    it('detects java by public static void main', () => {
      const code = `public static void main(String[] args) {
    System.out.println("Hello");
}`
      expect(detectLanguage(code)).toBe('java')
    })

    it('detects java by public class', () => {
      const code = `public class MyClass {
    private int value;
}`
      expect(detectLanguage(code)).toBe('java')
    })

    it('detects java by package declaration', () => {
      const code = `package com.example.myapp;
public class Main {}`
      expect(detectLanguage(code)).toBe('java')
    })

    it('detects java by protected method', () => {
      const code = `protected void doSomething() {
    // implementation
}`
      expect(detectLanguage(code)).toBe('java')
    })
  })

  describe('TypeScript detection', () => {
    it('detects typescript by type annotation', () => {
      const code = `const name: string = "John";
const age: number = 30;`
      expect(detectLanguage(code)).toBe('typescript')
    })

    it('detects typescript by interface', () => {
      const code = `interface User {
    id: number;
    name: string;
}`
      expect(detectLanguage(code)).toBe('typescript')
    })

    it('detects typescript by type alias', () => {
      const code = 'type Point = { x: number; y: number };'
      expect(detectLanguage(code)).toBe('typescript')
    })

    it('detects typescript by generic', () => {
      const code = `function identity<T>(arg: T): T {
    return arg;
}`
      expect(detectLanguage(code)).toBe('typescript')
    })

    it('detects typescript by as keyword', () => {
      const code = 'const value = something as string;'
      expect(detectLanguage(code)).toBe('typescript')
    })

    it('detects typescript by implements', () => {
      const code = `class Dog implements Animal {
    speak() {
        console.log("Woof!");
    }
}`
      expect(detectLanguage(code)).toBe('typescript')
    })

    it('detects typescript by enum', () => {
      const code = `enum Direction {
    Up,
    Down,
    Left,
    Right
}`
      expect(detectLanguage(code)).toBe('typescript')
    })
  })

  describe('CSS detection', () => {
    it('detects css by class selector', () => {
      const code = `.container {
    display: flex;
    margin: 10px;
}`
      expect(detectLanguage(code)).toBe('css')
    })

    it('detects css by id selector', () => {
      const code = `#main {
    color: red;
}`
      expect(detectLanguage(code)).toBe('css')
    })

    it('detects css by @media query', () => {
      const code = `@media (min-width: 768px) {
    .container {
        display: grid;
    }
}`
      expect(detectLanguage(code)).toBe('css')
    })

    it('detects css by @keyframes', () => {
      const code = `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}`
      expect(detectLanguage(code)).toBe('css')
    })

    it('detects css by property declarations', () => {
      const code = `.box {
    color: #ff0000;
    background-color: blue;
    margin: 20px;
    padding: 10px;
}`
      expect(detectLanguage(code)).toBe('css')
    })

    it('detects css by hex color', () => {
      const code = `.button {
    color: #fff;
    border: 1px solid #333;
}`
      expect(detectLanguage(code)).toBe('css')
    })
  })

  describe('HTML detection', () => {
    it('detects html by DOCTYPE', () => {
      const code = `<!DOCTYPE html>
<html>
<head></head>
<body></body>
</html>`
      expect(detectLanguage(code)).toBe('html')
    })

    it('detects html by script tag', () => {
      const code = `<script>
console.log("Hello");
</script>`
      expect(detectLanguage(code)).toBe('html')
    })

    it('detects html by closing tags', () => {
      const code = `<div>
    <p>Content</p>
</div>`
      expect(detectLanguage(code)).toBe('html')
    })

    it('detects html by style tag', () => {
      const code = `<style>
.container { color: red; }
</style>`
      expect(detectLanguage(code)).toBe('html')
    })
  })

  describe('JSON detection', () => {
    it('detects json by object with string values', () => {
      const code = `{
    "name": "John",
    "age": 30
}`
      expect(detectLanguage(code)).toBe('json')
    })

    it('detects json by array of objects', () => {
      const code = `[
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
]`
      expect(detectLanguage(code)).toBe('json')
    })

    it('detects json by true/false/null', () => {
      const code = `{"active": true, "deleted": false, "data": null}`
      expect(detectLanguage(code)).toBe('json')
    })
  })

  describe('SQL detection', () => {
    it('detects sql by SELECT statement', () => {
      const code = 'SELECT * FROM users WHERE id = 1;'
      expect(detectLanguage(code)).toBe('sql')
    })

    it('detects sql by INSERT statement', () => {
      const code = `INSERT INTO users (name, email) VALUES ('John', 'john@example.com');`
      expect(detectLanguage(code)).toBe('sql')
    })

    it('detects sql by UPDATE statement', () => {
      const code = `UPDATE users SET name = 'Jane' WHERE id = 1;`
      expect(detectLanguage(code)).toBe('sql')
    })

    it('detects sql by CREATE TABLE statement', () => {
      const code = `CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);`
      expect(detectLanguage(code)).toBe('sql')
    })

    it('detects sql by DELETE statement', () => {
      const code = 'DELETE FROM users WHERE id = 1;'
      expect(detectLanguage(code)).toBe('sql')
    })
  })

  describe('Go detection', () => {
    it('detects go by package declaration', () => {
      const code = `package main

func main() {
    fmt.Println("Hello")
}`
      expect(detectLanguage(code)).toBe('go')
    })

    it('detects go by func declaration', () => {
      const code = `func hello() {
    fmt.Println("Hello")
}`
      expect(detectLanguage(code)).toBe('go')
    })

    it('detects go by short declaration', () => {
      const code = `name := "John"
age := 30`
      expect(detectLanguage(code)).toBe('go')
    })

    it('detects go by fmt import', () => {
      const code = `import "fmt"

func main() {
    fmt.Println("Hello")
}`
      expect(detectLanguage(code)).toBe('go')
    })

    it('detects go by err check', () => {
      const code = `if err != nil {
    return err
}`
      expect(detectLanguage(code)).toBe('go')
    })
  })

  describe('Rust detection', () => {
    it('detects rust by fn keyword', () => {
      const code = `fn main() {
    println!("Hello");
}`
      expect(detectLanguage(code)).toBe('rust')
    })

    it('detects rust by let mut', () => {
      const code = `let mut counter = 0;
counter += 1;`
      expect(detectLanguage(code)).toBe('rust')
    })

    it('detects rust by impl keyword', () => {
      const code = `impl Display for MyStruct {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "value: {}", self.value)
    }
}`
      expect(detectLanguage(code)).toBe('rust')
    })

    it('detects rust by pub fn', () => {
      const code = `pub fn public_function() {
    // public function body
}`
      expect(detectLanguage(code)).toBe('rust')
    })

    it('detects rust by println macro', () => {
      const code = `println!("Value: {}", x);`
      expect(detectLanguage(code)).toBe('rust')
    })

    it('detects rust by match', () => {
      const code = `match value {
    Some(v) => println!("{}", v),
    None => println!("No value"),
}`
      expect(detectLanguage(code)).toBe('rust')
    })
  })

  describe('Bash detection', () => {
    it('detects bash by shebang', () => {
      const code = `#!/bin/bash

echo "Hello World"
ls -la`
      expect(detectLanguage(code)).toBe('bash')
    })

    it('detects bash by echo command', () => {
      const code = `echo "Installing dependencies..."
npm install`
      expect(detectLanguage(code)).toBe('bash')
    })

    it('detects bash by variable usage', () => {
      const code = `NAME="World"
echo "Hello, $NAME!"`
      expect(detectLanguage(code)).toBe('bash')
    })

    it('detects bash by grep', () => {
      const code = `grep "pattern" file.txt`
      expect(detectLanguage(code)).toBe('bash')
    })
  })

  describe('PHP detection', () => {
    it('detects php by php opening tag', () => {
      const code = `<?php
echo "Hello, World!";
?>`
      expect(detectLanguage(code)).toBe('php')
    })

    it('detects php by dollar variables', () => {
      const code = `<?php
$name = "John";
echo $name;
?>`
      expect(detectLanguage(code)).toBe('php')
    })

    it('detects php by arrow method call', () => {
      const code = `<?php
$user->getName();
?>`
      expect(detectLanguage(code)).toBe('php')
    })
  })

  describe('Ruby detection', () => {
    it('detects ruby by end keyword', () => {
      const code = `def hello
    puts "Hello"
end`
      expect(detectLanguage(code)).toBe('ruby')
    })

    it('detects ruby by puts', () => {
      const code = `puts "Hello, World!"`
      expect(detectLanguage(code)).toBe('ruby')
    })

    it('detects ruby by require', () => {
      const code = `require 'json'

data = JSON.parse(json_string)`
      expect(detectLanguage(code)).toBe('ruby')
    })

    it('detects ruby by class variables', () => {
      const code = `class User
    def initialize(name)
        @name = name
    end
end`
      expect(detectLanguage(code)).toBe('ruby')
    })
  })

  describe('C++ detection', () => {
    it('detects cpp by include directive', () => {
      const code = `#include <iostream>

int main() {
    std::cout << "Hello" << std::endl;
    return 0;
}`
      expect(detectLanguage(code)).toBe('cpp')
    })

    it('detects cpp by std namespace', () => {
      const code = `std::vector<int> numbers;
std::cout << "Size: " << numbers.size();`
      expect(detectLanguage(code)).toBe('cpp')
    })

    it('detects cpp by nullptr', () => {
      const code = 'int* ptr = nullptr;'
      expect(detectLanguage(code)).toBe('cpp')
    })

    it('detects cpp by cout', () => {
      const code = `cout << "Hello" << endl;`
      expect(detectLanguage(code)).toBe('cpp')
    })
  })

  describe('JavaScript detection (fallback)', () => {
    it('detects javascript by console.log', () => {
      const code = `console.log("Hello, World!");`
      expect(detectLanguage(code)).toBe('javascript')
    })

    it('detects javascript by arrow function', () => {
      const code = 'const add = (a, b) => a + b;'
      expect(detectLanguage(code)).toBe('javascript')
    })

    it('detects javascript by const/let', () => {
      const code = `const name = "John";
let age = 30;`
      expect(detectLanguage(code)).toBe('javascript')
    })
  })
})
