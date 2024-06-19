create table boards
(
    id             serial
        primary key,
    title          varchar(200) not null,
    user_id        integer
        constraint fk_boards_users_id
            references users
            on update cascade on delete cascade,
    board_statuses integer[] default '{}'::integer[]
);

alter table boards
    owner to proman;

