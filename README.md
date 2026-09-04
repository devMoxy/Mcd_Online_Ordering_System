# McDonald's Clone

A full-stack clone of a McDonald's-style online ordering system. Customers can create an account, browse the menu, build an order, check out, and see their order history. This is a portfolio project, not affiliated with McDonald's.

Live demo: http://mcdonalds-clone-frontend-6759fb.s3-website.eu-west-2.amazonaws.com

## Why I Built This

I worked at McDonald's for a while and used the ordering system from behind the counter every day. I got curious about what was actually happening underneath it, the database, the order flow, the way an order moves from placed to preparing to ready. I wanted to see if I could build a working version of it myself, end to end, not just the part customers see but the backend and the deployment behind it too.

## Tech Stack

**Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, Flyway, JWT (jjwt), Maven

**Frontend:** plain HTML, CSS, and JavaScript. No framework, no build step.

**Infrastructure:** Docker, AWS ECR, AWS ECS (Fargate), AWS RDS, AWS S3, AWS CloudWatch

## What I Built

I built all of it: the database schema, every backend layer (entities, repositories, DTOs, services, controllers), JWT auth with separate customer and admin roles, the Docker setup, and the AWS deployment. The frontend is intentionally simple since the focus of this project was the backend and the infrastructure around it.

## Features

- Account registration and login with JWT
- Menu browsing grouped by category
- Cart and checkout, with prices locked in at the moment of purchase so a later menu price change doesn't rewrite someone's past order
- Order history per user
- Admin endpoints to move an order through its status: placed, preparing, ready

## Problems Worth Mentioning

Partway through deploying this, AWS closed App Runner to new customers, which was the service the whole deployment plan was built around. I had to switch to ECS Fargate instead, mid-project, without redoing the parts that already worked (the Docker image, the database, the security setup).

A subtler one: I wrote a CORS configuration bean early on but never actually wired it into Spring Security's filter chain. Every test I ran through Postman passed fine, since Postman doesn't enforce CORS the way a browser does. The bug stayed completely invisible until I built the real frontend and a browser started blocking every request. One missing line fixed it, but finding it meant realizing my whole testing method had a blind spot.

Another one showed up during the ECS switch. I pushed a fixed Docker image and redeployed, but the fix never actually applied. The task definition was pinned to a specific image digest instead of the `:latest` tag, so restarting the service just restarted the same broken container over and over. I had to register a new task definition revision pointing at the actual new image before the fix took effect.

I also hit a Lombok and JDK version mismatch early on that crashed the compiler with an internal error (`TypeTag :: UNKNOWN`). Turned out Lombok's version has to match whatever JDK is actually compiling the code, not just whatever the IDE shows as selected.

## Architecture
<img width="400" height="400" alt="mcdonalds-clone-architecture" src="https://github.com/user-attachments/assets/5e19eb32-5243-4e97-bdbe-3b29f337b7f1" />

*Deployment architecture: a static frontend hosted on S3 calls a Spring Boot API running on ECS Fargate, behind an Application Load Balancer inside a VPC. The API connects to a PostgreSQL database on RDS, pulls its container image from ECR, and ships logs to CloudWatch.*

## Running It Locally

**Backend**
1. Clone the repo.
2. Start a local Postgres instance: `docker compose up -d`
3. Open the project in IntelliJ (or any IDE with Maven support) and run `McdonaldsCloneApplication`. Flyway creates the schema and seeds the menu automatically on first boot.
4. The API runs on `localhost:8080`.

**Frontend**
1. Open `frontend/index.html` directly in a browser. No build step needed.
2. By default it points at the live deployed backend. To test against your local backend instead, change `API_BASE` at the top of `frontend/app.js` to `http://localhost:8080`.
