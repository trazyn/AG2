
#!/bin bash

export LC_CTYPE=C
export LANG=C

set DB_DEV_USER='USERNAME'
set DB_DEV_PASS='PASSWD'

mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "drop database if exists \`aresguo\`; create database \`aresguo\` CHARACTER SET \`utf8\` COLLATE \`utf8_bin\`; grant all on *.* to ${DB_DEV_USER}@localhost identified by \"${DB_DEV_PASS}\"; grant all privileges on \`aresguo\`.* to ${DB_DEV_USER}@localhost;"

# CREATE USER TABLE
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; create table user (id int(32) unsigned primary KEY AUTO_INCREMENT, username varchar(255), about varchar(2000), password varchar(255), index indexUsername (username asc), index indexPassword (password asc) );"
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into user (username, password) values ('aresguo', 'e10adc3949ba59abbe56e057f20f883e') "

# CRAETE VIDEO TABLE
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; create table video (id int(32) unsigned primary KEY AUTO_INCREMENT, type int(11) unsigned, cover varchar(255), source varchar(255));"
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into video (type, cover, source) values ('1', 'uploads/2016-01/film.png', 'images/agVideo.mp4') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into video (type, cover, source) values ('2', 'uploads/2016-01/about.png', 'images/agVideo.mp4') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into video (type, cover, source) values ('3', 'uploads/2016-01/category-wedding.jpg', 'images/agVideo.mp4') "

# CREATE GALLERY TABLE
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; create table gallery (id int(32) unsigned primary KEY AUTO_INCREMENT, type int(11) unsigned, teaser varchar(255), hidpi varchar(255), title varchar(255), create_date timestamp default current_timestamp);"
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('1', 'https://d13yacurqjgara.cloudfront.net/users/4859/screenshots/2473493/rev3_teaser.png', 'https://d13yacurqjgara.cloudfront.net/users/4859/screenshots/2473493/rev3.png', 'Medical app UI design') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('4', 'https://d13yacurqjgara.cloudfront.net/users/561698/screenshots/2474108/sketchteve_dribbble_teaser.jpg', 'https://d13yacurqjgara.cloudfront.net/users/561698/screenshots/2474108/sketchteve_dribbble.jpg', 'Hello Dribbble!') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('4', 'https://d13yacurqjgara.cloudfront.net/users/21264/screenshots/2473051/abc3_teaser.png', 'https://d13yacurqjgara.cloudfront.net/users/21264/screenshots/2473051/abc3.png', 'Russian ABC Book') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('2', 'https://d13yacurqjgara.cloudfront.net/users/13865/screenshots/2473286/hn_shirt_teaser.jpg', 'https://d13yacurqjgara.cloudfront.net/users/13865/screenshots/2473286/hn_shirt.jpg', '#HugNecks!') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('3', 'https://d13yacurqjgara.cloudfront.net/users/82717/screenshots/2473202/post_teaser.png', 'https://d13yacurqjgara.cloudfront.net/users/82717/screenshots/2473202/post.png', 'Design Resources - Watches ⌚️') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('1', 'https://d13yacurqjgara.cloudfront.net/users/739323/screenshots/2473497/shop_app800x600_teaser.png', 'https://d13yacurqjgara.cloudfront.net/users/739323/screenshots/2473497/shop_app800x600.png', 'Shop App') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('3', 'https://d13yacurqjgara.cloudfront.net/users/746931/screenshots/2473466/onepro_logistic_teaser.jpg', 'https://d13yacurqjgara.cloudfront.net/users/746931/screenshots/2473466/onepro_logistic.jpg', 'Onepro | Home Logistic') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('4', 'https://d13yacurqjgara.cloudfront.net/users/285803/screenshots/2473433/final_teaser.gif', 'https://d13yacurqjgara.cloudfront.net/users/285803/screenshots/2473433/final.gif', 'Netflix Login') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('4', 'https://d13yacurqjgara.cloudfront.net/users/720015/screenshots/2473251/dribbble_debut_teaser.gif', 'https://d13yacurqjgara.cloudfront.net/users/720015/screenshots/2473251/dribbble_debut.gif', 'Dribbble Debut') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('3', 'https://d13yacurqjgara.cloudfront.net/users/736144/screenshots/2473547/04_teaser.jpg', 'https://d13yacurqjgara.cloudfront.net/users/736144/screenshots/2473547/04.jpg', '*1 Render a Day // 04') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('1', 'https://d13yacurqjgara.cloudfront.net/users/5746/screenshots/2473353/dribbble-salvatier-superman_teaser.jpg', 'https://d13yacurqjgara.cloudfront.net/users/5746/screenshots/2473353/dribbble-salvatier-superman.jpg', 'Superman') "
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into gallery (type, teaser, hidpi, title) values ('1', 'https://d13yacurqjgara.cloudfront.net/users/88368/screenshots/2473349/3-guys_teaser.jpg', 'https://d13yacurqjgara.cloudfront.net/users/88368/screenshots/2473349/3-guys.jpg', '3 Guys') "

# CREATE POSTS TABLE
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; create table posts (id int(32) unsigned primary KEY AUTO_INCREMENT, create_by varchar(64), teaser varchar(255), title varchar(255), content text, create_date timestamp default current_timestamp);"
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into posts (create_by, teaser, title, content) values ('ares guo', 'https://images.unsplash.com/photo-1452571817344-8d5a4c2100c6?crop=entropy&fit=crop&fm=jpg&h=1050&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=1825', 'words you might not know: a wedding glossary', 'weddings are beautiful. joyous. amazing! but also … confusing. even before you get into all of the plans and decisions, the very words that people use to talk about weddings can sound like another language. i\'ve been shooting weddings for 12 years, and every once in a while i still encounter a new wedding word -- haha!')"
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into posts (create_by, teaser, title, content) values ('ares guo', 'https://images.unsplash.com/photo-1452571817344-8d5a4c2100c6?crop=entropy&fit=crop&fm=jpg&h=1050&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=1825', 'Arizona Biltmore Wedding Inspiration Feature', 'weddings are beautiful. joyous. amazing! but also … confusing. even before you get into all of the plans and decisions, the very words that people use to talk about weddings can sound like another language. i\'ve been shooting weddings for 12 years, and every once in a while i still encounter a new wedding word -- haha!')"
mysql -u ${DB_DEV_USER} -p${DB_DEV_PASS} -e "use aresguo; insert into posts (create_by, teaser, title, content) values ('ares guo', 'https://images.unsplash.com/photo-1452571817344-8d5a4c2100c6?crop=entropy&fit=crop&fm=jpg&h=1050&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=1825', '50 Goals For Your First Year In Business', 'weddings are beautiful. joyous. amazing! but also … confusing. even before you get into all of the plans and decisions, the very words that people use to talk about weddings can sound like another language. i\'ve been shooting weddings for 12 years, and every once in a while i still encounter a new wedding word -- haha!')"
