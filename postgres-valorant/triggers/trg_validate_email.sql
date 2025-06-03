CREATE OR REPLACE FUNCTION trg_validate_email()
RETURNS TRIGGER AS $$
DECLARE
    email_count INT;
BEGIN
    -- Verificar que el email no exista en otro registro
    SELECT COUNT(*) INTO email_count
    FROM info_players
    WHERE email = NEW.email
      AND id <> COALESCE(NEW.id, 0);

    IF email_count > 0 THEN
        RAISE EXCEPTION 'El email % ya está registrado en otro usuario.', NEW.email;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_email_format_check
BEFORE INSERT OR UPDATE ON info_players
FOR EACH ROW
EXECUTE FUNCTION trg_validate_email();

