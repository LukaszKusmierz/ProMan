create table users
(
    id        serial
        constraint users_pk
            primary key,
    user_name varchar,
    email     varchar,
    password  varchar
);

alter table users
    owner to proman;

