--1 INSERT TONY
INSERT INTO account (account_firstname,account_lastname,account_email,account_password)
VALUES ('Tony','Stark','tony@starkent.com','Iam1ronM@n');

--2 UPDATE TYPE 
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--3 DELETE
DELETE FROM account
WHERE account_email = 'tony@starkent.com';


SELECT * FROM inventory;

--4 UPDATE DESCRIPTION
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM';

--5 INNER JOIN
SELECT 
    inventory.inv_make, 
    inventory.inv_model, 
    classification.classification_name
FROM 
    public.inventory
INNER JOIN 
    public.classification
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';

--6 REPLACE URL IMAGES
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');