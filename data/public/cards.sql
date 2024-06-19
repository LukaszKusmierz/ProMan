create table cards
(
    id           serial
        primary key,
    board_id     integer      not null
        constraint fk_cards_board_id
            references boards
            on delete cascade,
    status_id    integer      not null
        constraint fk_cards_status_id
            references statuses,
    title        varchar(200) not null,
    card_message varchar
);

alter table cards
    owner to proman;

