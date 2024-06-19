create table statuses
(
    id           serial
        primary key,
    title        varchar(200) not null,
    status_cards integer[] default ARRAY []::integer[],
    board_id     integer
        constraint fk_statuses_board
            references boards
            on delete cascade
);

alter table statuses
    owner to proman;

