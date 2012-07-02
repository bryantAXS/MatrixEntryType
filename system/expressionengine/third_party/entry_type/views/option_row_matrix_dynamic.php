		<tr>
			<td><?=form_input(sprintf('matrix[cols][col_id_%s][settings][entry_type_options][%s][value]',$col_id, $i), $value)?></td>
			<td><?=form_input(sprintf('matrix[cols][col_id_%s][settings][entry_type_options][%s][label]',$col_id, $i), $label)?></td>
			<td><?=form_multiselect(sprintf('matrix[cols][col_id_%s][settings][entry_type_options][%s][hide_fields][]',$col_id, $i), $fields, $hide_fields)?></td>
			<td><a href="javascript:void(0);" class="entry_type_remove_row_matrix"><?=img(array('border' => '0', 'src' => $this->config->item('theme_folder_url').'cp_themes/default/images/content_custom_tab_delete.png'))?></a></td>
		</tr>
