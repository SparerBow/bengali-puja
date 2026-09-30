USE banglapuja;

SET NAMES utf8mb4;

UPDATE pujas
SET bengali_name = 'দুর্গাপূজা'
WHERE slug = 'durga-puja';

UPDATE pujas
SET bengali_name = 'লক্ষ্মীপূজা'
WHERE slug = 'lakshmi-puja';

UPDATE pujas
SET bengali_name = 'সরস্বতীপূজা'
WHERE slug = 'saraswati-puja';

UPDATE pujas
SET bengali_name = 'কালীপূজা'
WHERE slug = 'kali-puja';

UPDATE pujas
SET bengali_name = 'জগদ্ধাত্রীপূজা'
WHERE slug = 'jagaddhatri-puja';
