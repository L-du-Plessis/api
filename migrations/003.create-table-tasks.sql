-- CREATE TABLE 'TASKS' IF IT DOES NOT EXIST
--
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_time` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  `next_execute_date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- create index for table 'tasks'
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY IF NOT EXISTS (`id`);
  
-- AUTO_INCREMENT for table 'tasks'
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

