# PHPUnit in Symfony

<img src="https://www.svgrepo.com/show/373974/phpunit.svg" width="150px" height="auto" />

> Based on some personal research and a bit of help from [Claude.ai](https://claude.ai/chat/).

### Quick Note

Like always, this cheat sheet isn't perfect. If you need something official, check out [PHPUnit's docs](https://phpunit.de/documentation.html). Also, this assumes you've written tests in another language before.

### Installation

Start with:

```sh
composer require --dev symfony/test-pack
```

That sets you up with everything you need for testing in Symfony. After installing, a `tests/` directory will pop up in your root folder. Inside that, split your tests into `Unit/`, `E2e/`, and `Integration/`. The idea is to mirror your `src/` directory inside the `tests/` folder. Also, PHPUnit looks for files that end with `Test.php` or have "test" in their name.

### Example Structure

```php
<?php

namespace App\Tests\Unit\Entity;

use PHPUnit\Framework\TestCase;

class DinosaurTest extends TestCase
{
    // Prefix your functions with "test" to run them as tests
    public function testItWorks()
    {
        $this->assertEquals(42, 42);
    }
}
```

### Running Tests

To run the tests, use:

```sh
./bin/phpunit
```

### Data Providers

PHPUnit also supports parameterized tests using data providers, which are quite similar to PyTest. You define a function that returns the data and use it in your tests.

```php
<?php

namespace App\Tests\Unit\Stuff;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class TestStuff extends TestCase
{
    public static function generateNumbersAndStrings(): \Generator
    {
        yield [1, 'one'];
        yield [2, 'two'];
        yield [3, 'three'];
    }

    #[DataProvider('generateNumbersAndStrings')]
    public function testItWorks($number, $string): void
    {
        $this->assertEquals($number, $number);
        $this->assertEquals($string, $string);
    }
}
```

### Mocking

In my opinion PHPUnit has a much better mocking system than PyTest (or Vitest). It's easy, straight forward and self-explaining.

```php
<?php

use PHPUnit\Framework\TestCase;

class MyServiceTest extends TestCase
{
    public function testSomething()
    {
        $mock = $this->createMock(DependencyClass::class);
        $mock->method('someMethod')->willReturn('mocked value');

        $service = new MyService($mock);
        // Now test $service...
    }
}
```

You can also verify that specific methods were called:

```php
<?php

$mock->expects($this->once())
    ->method('someMethod')
    ->with($this->equalTo('expected argument'));
```

### Testing Exceptions

Sometimes you want to test if an error is throws. That's why you can also catch errors in PHPUnit.

```php
<?php

public function testExceptionIsThrown()
{
    $this->expectException(InvalidArgumentException::class);
    $this->expectExceptionMessage('Expected error message');

    $obj = new MyClass();
    $obj->methodThatShouldThrowException();
}
```

### Symfony-Specific Tests

Often you want to assign to the returns of controllers. Since we use Symfony Test Pack and not PHPUnit, this is very easy thanks to the `WebTestCase` class.

```php
<?php

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MyControllerTest extends WebTestCase
{
    public function testIndexAction()
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Welcome');
    }
}
```

<br>
Symfony's test-pack does also bring us the ability to test custom commands.

```php
<?php

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class MyCommandTest extends KernelTestCase
{
    public function testExecute()
    {
        $kernel = self::bootKernel();
        $app = new Application($kernel);

        $command = $app->find('app:my-command');
        $commandTester = new CommandTester($command);
        $commandTester->execute([]);

        $this->assertStringContainsString('Expected output', $commandTester->getDisplay());
    }
}
```

### Code Coverage

If X-Debug is inabled you can run the following command to create an HTML report in the `coverage/` folder.

```sh
./bin/phpunit --coverage-html coverage
```

## Show Off Knowledge

### The Power Of Assert

Here are a few basic assertion methods that you'll probably use most of the time:

| Assertion Method                    | What it does                                   | Example                                |
| ----------------------------------- | ---------------------------------------------- | -------------------------------------- |
| `assertEquals($expected, $actual)`  | Checks if two values are equal                 | `assertEquals(5, $result)`             |
| `assertSame($expected, $actual)`    | Strict comparison (like `===` in PHP)          | `assertSame('foo', $result)`           |
| `assertTrue($condition)`            | Checks if a condition is true                  | `assertTrue($result)`                  |
| `assertFalse($condition)`           | Checks if a condition is false                 | `assertFalse($result)`                 |
| `assertNull($actual)`               | Asserts that a variable is null                | `assertNull($result)`                  |
| `assertInstanceOf($class, $object)` | Checks if a variable is an instance of a class | `assertInstanceOf(User::class, $user)` |

But assertions are a much bigger topic than covered here. Check out the [assertions appendix](https://docs.phpunit.de/en/11.3/assertions.html#) in the [official PHPUnit documentation](https://docs.phpunit.de/) to learn more.
