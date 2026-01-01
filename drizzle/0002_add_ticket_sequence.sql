-- Create sequence for ticket numbers starting at 1
CREATE SEQUENCE IF NOT EXISTS ticket_sequence START
WITH
    1 INCREMENT BY 1;