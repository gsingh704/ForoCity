# ForoCity

ForoCity is a web forum that allows users to create and participate in discussion topics of their city. It has groups divided by cities and topics divided by categories (By using Tags). User can create posts for each topic and comment on them. It has also votes so that user can search for the most popular topics. It also have direct messages between users.

# URL

http://84.235.233.11

# How to run the project

-   Clone the project

```bash
git clone
```

-   Install the dependencies

```bash
composer install
```

-   Run the project

```bash
sail up -d
```

-   Run composer with sail

```bash
sail composer install
```

-   Run the migrations and seeders **This part is very important, wait for the database to be ready**

```bash
sail artisan migrate:fresh --seed
```

-   Install the dependencies

```bash
sail npm install
```

-   Run the project

```bash
sail npm run dev
```

# Check the emails

I have used mailpit to simulate the emails. You can check the emails in the following link: http://84.235.233.11:8025
