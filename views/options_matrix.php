<table width="100%" style="width:500px;" id="entry_type_options_matrix" class="mainTable">
	<thead>
		<tr>
			<th><?=lang('type_value')?></th>
			<th><?=lang('type_label')?></th>
			<th><?=lang('hide_cells')?></th>
			<th style="width:1%;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
<?php $i = 0; ?>
<?php foreach ($type_options as $value => $data) : ?>
<?=$this->load->view('option_row_matrix', array('i' => (string) $i, 'value' => $value, 'label' => $data['label'], 'hide_fields' => $data['hide_fields'], 'fields' => $fields), TRUE)?>
<?php $i++; ?>
<?php endforeach; ?>
	</tbody>
</table>
<p><a href="javascript:void(0);" id="entry_type_add_row_matrix"><?=lang('add_type')?></a><a style='margin-left:20px;' href="javascript:void(0);" id="entry_type_refresh_cells"><?=lang('refresh_cells')?></a></p>