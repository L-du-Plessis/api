-- CREATE TABLE 'USERS' IF IT DOES NOT EXIST
--
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- create index for table 'users'
--
ALTER TABLE `users`
  ADD PRIMARY KEY IF NOT EXISTS (`id`);
  
-- AUTO_INCREMENT for table 'users'
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

