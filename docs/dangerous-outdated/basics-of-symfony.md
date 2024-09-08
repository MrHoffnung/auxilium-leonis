# Basics of Symfony

<img src="https://www.svgrepo.com/show/342277/symfony.svg" width="150px" height="auto">


## Pre-Requirements:

- **PHP**: [Install](https://www.geeksforgeeks.org/how-to-install-php-on-ubuntu/)
- **Docker**: [Install](https://docs.docker.com/engine/install/ubuntu/)
- **DDEV**: [Install](https://ddev.readthedocs.io/en/stable/users/install/ddev-installation/)

## Installation

**1. Step**: Create the project directory and switch into this directory:

```
mkdir <project>
```

```
cd <project>
```

**2. Step**: Initialize the DDEV project (select `public` for docroot location):

```
mkdir <project>
```

**3. Step**: Change the DDEV PHP version to the [newest stable PHP build]():

```
nano .ddev/config.yaml
```

**4. Step**: Cleaning up:

```
ddev config global --required-docker-compose-version="" --use-docker-compose-from-path=false
```

```
sudo docker system prune --all --force
```

```
sudo docker volume prune --force
```

**5. Step**: Starting DDEV:

```
ddev start
```

**6. Step**: Installing Symfony:

```
ddev composer create symfony/skeleton
```

## Project Structure

In a Symfony project, there are several standard folders, each serving specific purposes:

- **`bin/`**: Contains executable files, such as the Symfony console application (`bin/console`).

- **`config/`**: Houses the configuration files for the application, where various settings are defined.

- **`src/`**: This is where the PHP code of the project resides, including controllers, services, and other application logic.

- **`public/`**: The web root directory, containing publicly accessible files like images, stylesheets, and JavaScript. It also includes the `index.php`, which acts as the front controller.

- **`var/`**: Used for generated files such as cache and logs.

- **`vendor/`**: Contains third-party dependencies managed by Composer. This folder should not be manually modified.

- **`tests/`**: Holds automated tests for the application, including unit tests.

This structure helps keep the code organized and improves the maintainability of the application.

## Controller

A controller in Symfony is a PHP class responsible for handling HTTP requests and returning HTTP responses based on the application's logic.

```php
// Define the IndexController class.
// This is a controller that will handle certain HTTP requests.
class IndexController {

    // Use the Route annotation to map the root URL (/) to this method.
    // The 'name' attribute gives this route a name, 'index', which can be used in the application.
    #[Route(path: '/', name: 'index')]
    public function indexAction(): Response {

        // Return a new Response object with the text "Hallo Welt!".
        // This text will be sent back to the user's browser when they visit the root URL.
        return new Response("Hallo Welt!");
    }
}

?>
```

## Templates

Before we can use templates, we have to install `Twig` first:

```
ddev composer require twig
```

After the execution of this command a new folder named `templates/` will be created.
<br>
To render a template, [our controller](#controller) must inherit from `AbstractController`. An `AbstractController` can use the `render` method:

```php
<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class IndexController extends AbstractController {

    #[Route(path: '/', name: 'index')]
    public function indexAction(): Response {

        return $this->render('index.html.twig');
    }
}

?>
```

## Installing Tailwind

**1. Step**: Install the Tailwind Bundle:

```
composer require symfonycasts/tailwind-bundle
```

**2. Step**: Initialize Tailwind:

```
php bin/console tailwind:init
```

**3. Step**: Build and Watch for Changes (must be executed on every DDEV startup):

```
php bin/console tailwind:build --watch
```

## CSRF

Before we can use forms, we have to install `Security-CSRF` first:

```
ddev composer require symfony/security-csrf
```

### CSRF in Forms

## Forms

Symfony Forms provide a robust framework for building, processing, and validating forms in PHP applications, streamlining user input handling.<br>
Before we can use forms, we have to install `Forms` first:

```
ddev composer require symfony/form
```

By convention, forms are created in `src/Form/Type`.

```php
<?php

namespace App\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use App\Entity\GuestBookEntity;

class GuestBookType extends AbstractType
{
    // This method is where you define the fields that will appear in your form
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('username', TextType::class, ['empty_data' => '']);
        $builder->add('email', EmailType::class, ['required' => false]);
        $builder->add('subtitle', TextType::class, ['empty_data' => '']);
        $builder->add('body', TextType::class, ['empty_data' => '']);
        $builder->add('submit', SubmitType::class);
    }

    // This method is where you define options for the form, such as the data class (database model) it maps to
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => GuestBookEntity::class
        ]);
    }
}

```

<br>
To render a form, you have to submit the form in the context while loading the template:

```php
$form = $this->createForm(GuestBookType::class);

return $this->render('index.html.twig', [
    'form' => $form
]);
```

It is integrated into the template with the `{{ form(form) }}` template snippet.

<br>

You can add HTML attributes to the form elements by adding them in `$options`:

```php
$builder->add('username', TextType::class, ['empty_data' => '', 'attr' => ['class' => 'block']]);
```

<br>

You can use predefined stylings by adding them into `config/packages/twig.yaml`:

```yml
twig:
  file_name_pattern: "*.twig"
  form_themes: ["tailwind_2_layout.html.twig"]
```

<br>

The data transmitted by the form is obtained by handling the controller's request in the form. You can then call the getData method on the form.

```php
<?php

namespace App\Controller;

use App\Form\Type\GuestBookType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class IndexController extends AbstractController
{

    #[Route(path: '/', name: 'index')]
    public function indexAction(Request $request): Response
    {

        $form = $this->createForm(GuestBookType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $data = $form->getData();
            dd($data);
        }

        return $this->render('index.html.twig', [
            'form' => $form
        ]);
    }
}

```

## Entities & Databases

Entities are PHP classes that typically correspond to tables in a database. Each property of the class maps to a column in the table. Doctrine handles the persistence of these objects, meaning it automatically handles saving and retrieving data from the database.
<br>
By convention, entities are created in `src/Entity`.

```php
<?php

namespace App\Entity;

use DateTimeImmutable;

class GuestBookEntity
{
    private ?int $id;                  // Unique identifier (primary key)
    private DateTimeImmutable $createdAt; // Timestamp for when the entry was created
    private string $username;          // Name of the user making the entry
    private string $subtitle;          // Subtitle or title of the entry
    private string $body;              // Main content of the entry
    private ?string $email;            // Optional email address of the user

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable(); // Set creation time
    }

    // Getters and setters for each property...
}
```

<br>

Forms can be validated using entities. For this you need the `Validator` package:

```
ddev composer require symfony/validator
```

This is done via constraints and asserts.

```php
use Symfony\Component\Validator\Constraints as Assert;

class GuestBookEntity
{
    private ?int $id;
    private \DateTimeImmutable $createdAt;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    private string $username;
}
```

<br>

Before we can use databases, we have to install the `ORM-Pack` (`Doctrine`) and the `Maker-Bundle` (optional, just for development):

```
ddev composer require symfony/orm-pack
```

```
ddev composer require --dev symfony/maker-bundle
```

Im Anschluss muss man innerhalb der Entity die verschiedenen Columns annotieren sowie die Entity als Modell annotieren:

```php
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class GuestBookEntity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id;

    #[ORM\Column(type: 'datetime_immutable', options: ['default' => 'CURRENT_TIMESTAMP'])]
    private \DateTimeImmutable $createdAt;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string')]
    private string $username;

    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[ORM\Column(type: 'string')]
    private string $subtitle;

    #[Assert\NotBlank]
    #[ORM\Column(type: 'text')]
    private string $body;

    #[Assert\Email]
    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $email;
}
```

To create the migration we have to execute:

```
ddev exec bin/console make:migration
```

```
ddev exec bin/console doctrine:migrations:migrate
```

To save the form we need to hand over a readonly `EntityManagerInterface` to the constructor:

```php
<?php

namespace App\Controller;

use App\Form\Type\GuestBookType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
class IndexController extends AbstractController
{

    public function __construct(private readonly EntityManagerInterface $em)
    {

    }

    #[Route(path: '/', name: 'index')]
    public function indexAction(Request $request): Response
    {

        $form = $this->createForm(GuestBookType::class);
        # TODO: Request wird gehandled
        $form->handleRequest($request);

        # TODO: Form-Daten erhalten
        if ($form->isSubmitted()) {
            $data = $form->getData();
            $this->em->persist($data);
            $this->em->flush();
            return $this->redirectToRoute('index');
        }



        return $this->render('index.html.twig', [
            'form' => $form
        ]);
    }
}
```

By using the `EntityManagerServer` we can obtain all entries in the table.

```php
$repository = $this->em->getRepository(GuestBookEntity::class);
$entries = $repository->findBy([], ['createdAt' => 'DESC']);
```

## Repositories

In Symfony, a repository is a design pattern used in conjunction with the Doctrine ORM to manage database interactions for a specific entity. Each entity typically has its own repository, which acts as an interface for accessing and manipulating data related to that entity.
<br>
An example for a repository looks like this:

```php
<?php

namespace App\Repository;

use App\Entity\GuestBookEntity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class GuestBookRepository extends ServiceEntityRepository {
    public function __construct(private readonly ManagerRegistry $registry)
    {
        parent::__construct($this->registry, GuestBookEntity::class);
    }

    public function add(GuestBookEntity $guestBookEntity) {
        $manager = $this->getEntityManager();
        $manager->persist($guestBookEntity);
    }

    public function flush() {
        $this->getEntityManager()->flush();
    }
}

?>
```

And can be used like this:

```php
class IndexController extends AbstractController
{

    public function __construct(private readonly GuestBookRepository $repository)
    {

    }

    #[Route(path: '/', name: 'index')]
    public function indexAction(Request $request): Response
    {

        $form = $this->createForm(GuestBookType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $data = $form->getData();
            $this->repository->add($data);
            $this->repository->flush();
            $this->addFlash('success', 'Erfolgreich gespeichert.');
            return $this->redirectToRoute('index');
        }

        $limit = 2;
        $maxPages = $this->getMaxPages($limit);
        $currentPage = $this->getCurrentPage();

        $entries = $this->repository->findBy([], ['createdAt' => 'DESC']);

        return $this->render('index.html.twig', [
            'form' => $form,
            'entries' => $entries,
            'maxPages' => $maxPages
        ]);
    }
}
```

## Services

In Symfony, services are a fundamental concept that plays a crucial role in the architecture of applications. They are essentially PHP objects that perform specific tasks and are managed by the Symfony Service Container.
Services are typically defined in configuration files such as services.yaml. This file specifies the service ID, class name, and any constructor arguments needed for the service.
A common usecase for services are custom parameters in class constructors or the usage of .env variables.

```yml
parameters:

services:
  _defaults:
    autowire: true
    autoconfigure: true

  App\:
    resource: "../src/"
    exclude:
      - "../src/DependencyInjection/"
      - "../src/Entity/"
      - "../src/Kernel.php"

  # Hands the value of LIMIT in .env over to the first parameter of the constructor of IndexController
  App\Controller\IndexController:
    arguments:
      - "%env(resolve:LIMIT)%"
```

## Flash Messages

Flash messages in Symfony are a mechanism used to display temporary notifications to users, typically after a form submission or other actions that result in a page redirect. These messages are stored in the user's session and are automatically removed once they are read, ensuring they are only displayed once.

```php
$this->addFlash('success', 'Erfolgreich gespeichert.');
```

```twig
{% for label, messages in app.flashes %}
    {% for message in messages %}
        <p>{{ message }}</p>
    {% endfor %}
{% endfor %}
```
