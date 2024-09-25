Here is the text converted to Markdown format:

# Basics of Symfony

<img src="https://www.svgrepo.com/show/342277/symfony.svg" width="150px" height="auto" />

## Creating a Symfony App

```
symfony new <project-name> --webapp
cd <project-name>
symfony server:ca:install
symfony serve
```

## Controllers & Routing

In Symfony, controllers are responsible for processing HTTP requests (similar to views in Django). Controllers are created in `src/Controller` and are written in PascalCase because they are classes. By convention you create a controller inside the namespace `App\Controller`.

```php
namespace App\Controller;

class MainController
{

    #[Route('/')] // Attributes are similar to @decorators in Python
    public function homepage()
    {
        return new Response("<strong>Starshop</strong>: your monopoly-busting option for building starships");
    }
}
```

### Rendering Templates with Twig

To render a template the controller must inherit from `AbstractController` and Twig (`composer require twig`) must be installed. `AbstractController` has the method `render(filename, [parameters])`. As in Django, parameters (the context) are supported.

```php
class MainController extends AbstractController
{
    #[Route('/')]
    public function homepage(): Response
    {
        $startshipCount = 457;
        return $this->render('main/homepage.html.twig', [
            "starshipCount" => $startshipCount,
        ]);
    }
}
```

If you are interested in learning more about Twig visit the [official documentation](https://twig.symfony.com/). It is similar to Jinja and supports for example variables, conditional logic, extending, including, filters & blocks.

### Route Wildcards

Wildcards are like the parameters of routes. In Symfony the work relatively straight-forward. All you have to do is to write `{name<type>}` (where `type` is a regex and `name` a string that you choose) into your route and to add `type $name` to your function parameters.

```php
#[Route('/api/starships/{id<\d+>}')]
public function get(int $id): Response
{
    dd($id);
}
```

### Restricting HTTP Requests

To allow only selected HTTP request you can add the `methods` parameter into the `#[Route()]` attribute.

```php
#[Route('', methods: ['GET'])]
```

### Route Prefixing

You can also give a controller a route attribute. Every function's route in this controller will now inherit from the controller.

```php
#[Route('/api/starships')]
class StarshipApiController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function getCollection(StarshipRepository $repository): Response {}

    #[Route('/{id<\d+>}', methods: ['GET'])]
    public function get(int $id): Response {}
}

// This controller has the routes `api/starships/` and `api/starships/{id<\d+>}`
```

### Routing in Templates

Sometimes you want to push a user from one template to another. To make this possible you have to add the name parameter to the route attribute.

```php
#[Route('/starships/{id<\d+>}', name: 'app_starship_show')]
```

You can link to this page now in Twig templates by using the `path(route, parameters-object)` function.

```html
<a href="{{ path('app_starship_show', {id: myShip.id}) }}">{{ myShip.name }}</a>
```

## Services

Services are responsible for handling the logic of our application. That's why almost everything (except data-holding objects) is a service. To use services in our own services (I know that sounds a little bit weird) we just have to add them into the parameters of `__construct` or our function and Symfony takes care of the rest (called "auto-wiring"). Auto-Wiring is recommended to do in the constructor.

```php
public function getCollection(LoggerInterface $logger): Response {
    $logger->info('Starship collection retrieved');
}
```

### Creating Services

"Creating Services" also sounds weird, if I said, that everything is a service. The reason why you should create extra services, is to extract logic out of controller services, to make them reusable and cleaner. Such services are called repositories and they are created (by convention) in `src/Repository`.

Now we can simply implement our logic inside the service and use it in other services.

```php
// Repository Service
class StarshipRepository
{
    public function findAll(): array
    {
        return [
            new Starship(
                1,
                'Stupid LeafyCruiser (COCO-0001)',
                'Garden',
                'Nadin Jardin',
                "captured by the Borg"
            ),
            new Starship(
                2,
                'Stupid Espresso (COCO-1234-C)',
                'Latte',
                'Jane T. Quick!',
                "repaired"
            ),
            new Starship(
                3,
                'Stupid Wanderlust (COCO-2024-W)',
                'Delta Tourist',
                'Kathryn Journeyway',
                "under construction"
            )
        ];
    }
}
```

```php
// Controller service
class StarshipRepository
{
    public function findAll(LoggerInterface $logger): array
    {
        return $this->starshipRepository->findAll();
    }
}
```

## Databases & Entities

Symfony has a great ORM mapper called Doctrine, but this topic is so big that it deserves its own cheat sheet.

> **Doctrine in Symfony**: Coming Soon...

## Creating API Endpoints

Until now our controller can only deal with HTML, but often you want to create an API endpoint, for which you need to return JSON or objects.

### Returning JSON

It's really easy to return json. All you have to do is to return the `json()` method of the `AbstractController` class.

```php
class StarshipApiController extends AbstractController
{
    #[Route('/api/starships')]
    public function getCollection(): Response
    {
        $starships = [
            [
                'name' => 'USS LeafyCruiser (NCC-0001)',
            ],
            [
                'name' => 'USS Espresso (NCC-1234-C)',
            ],
            [
                'name' => 'USS Wanderlust (NCC-2024-W)',
            ],
        ];
        return $this->json($starships);
    }
}
```

### Returning Objects

To return objects we have to serialize them into JSON. To serialize objects we need Symfony's Serializer (`composer require serializer`). Now we can still use the `json()` method of the `AbstractController` class because Symfony takes care of using the features of serializer.

## Static Assets in Symfony

To use static assets in Symfony you *could* put them into the `public/` directory. But there is a better way: the asset mapper (`composer require symfony/asset-mapper symfony/asset`). Asset Mapper magically makes these assets available to the user. You can include static assets into templates by using `{{ asset(logical path) }}`.

## Tailwind CSS

To install Tailwind execute `composer require symfonycasts/tailwind-bundle`. After this run `php bin/console tailwind:init` to initialize Tailwind. To run the Tailwind watcher, all you have to do is to run `php bin/console tailwind:build -w`.

Now you might complain that it's to much expense to run `php bin/console tailwind:build -w`. No problem, Symfony got you.

## Testing

As in any language, unit testing is extremely important, which is why I dedicate a separate cheat sheet to it.

> **PHPUnit in Symfony**: Coming Soon...

## Showing Off Knowledge

### Debugging

Symfony has a powerful graphical debugger called Profiler which can be installed using `composer require debug`.

### Console

Additionally to it's CLI, every Symfony project has a powerful console `php bin/console`, which contains useful commands for caching, debugging, configuration, routing & more. It's also possible to create own commands.