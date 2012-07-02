var Entry_type_matrix_controller = function($entry_type_option){

	var self = this;
	self.$matrix_container = $entry_type_option.parents('tbody.matrix:eq(0)').find('#entry_type_options_matrix');
	self.$options_container = self.$matrix_container.parent().parent();
	self.$tbody = self.$matrix_container.find('tbody');

}

Entry_type_matrix_controller.prototype.init = function(){

	var self = this;

	//Add Type button clicked
	self.$options_container.find("#entry_type_add_row_matrix").bind("click", function(){
		self.add_row();
	});

	//Remove icon clicked
	self.$options_container.find(".entry_type_remove_row_matrix").bind("click", function(){
		if (confirm("'.lang('confirm_delete_type').'")) {
			self.remove_row($(this).parents("tbody").find(".entry_type_remove_row").index(this));
		}
	});

	//making the entry type columns sortable
	self.$tbody.sortable({
		stop: function(e, ui) {
			self.order_rows();
		}
	}).children("tr").css({cursor:"move"});

	//We need to refresh the multiselect options when a column label changes
	$("tbody.matrix tr.matrix:first-child + tr textarea.matrix-textarea").bind("blur",function(){
		self.refresh_cells();
	});

	//binding an event to the Refresh Cell names button
	self.$options_container.find("#entry_type_refresh_cells").bind("click",function(){
		self.refresh_cells();
	});

	//an event bound to the button which adds matrix columns
	$(".matrix-btn.matrix-add").bind("click",function(){
		console.log('yep');
		self.unbind_destroy();
		self.bind_destroy();
	});

}

Entry_type_matrix_controller.prototype.add_row = function(){
	var self = this;

	var row_template = EE.entryTypeMatrixSettings.rowTemplate.replace(/{{INDEX}}/g, $("#entry_type_options_matrix tbody tr").length);
	var $row_template = $(row_template);

	$row_template.find(".entry_type_remove_row_matrix").bind("click", function(){
		if (confirm("'.lang('confirm_delete_type').'")) {
			self.remove_row($(this).parents("tbody").find(".entry_type_remove_row").index(this));
		}
	});

	self.$tbody.append($row_template);

}

Entry_type_matrix_controller.prototype.remove_row = function(index){
	var self = this;
	
	$("#entry_type_options_matrix tbody tr").eq(index).remove();
	self.order_rows();

}

Entry_type_matrix_controller.prototype.order_rows = function(){
	
	$("#entry_type_options_matrix tbody tr").each(function(index){
		$(this).find(":input").each(function(){
			var match = $(this).attr("name").match(/^entry_type_options\[\d+\]\[(.*?)\]$/);
			if (match) {
				$(this).attr("name", "entry_type_options["+index+"]["+match[1]+"]");
			}
		});
	});

}

Entry_type_matrix_controller.prototype.clear_hide_fields = function(){

}

Entry_type_matrix_controller.prototype.refresh_cells = function(destroyed_el){
	var self = this;

	//destroyed el not passed
	if(! destroyed_el){
		destroyed_el = false;
	}

	var col_index = 1;
	var $multiselects = $("tbody.matrix tr.matrix select[multiple=multiple]");

	$multiselects.html("");
	
	$("tbody.matrix tr.matrix:first-child + tr textarea.matrix-textarea").each(function(){

		if(destroyed_el && destroyed_el == this){
			return;
		}

		var col_label = $(this).val();
		var $new_option = $("<option value=\""+col_index+"\">"+col_label+"</option>");
		$multiselects.append($new_option);
		
		col_index += 1;

	});

}

Entry_type_matrix_controller.prototype.bind_destroy = function(){
	var self = this;

	$("tbody.matrix tr.matrix:first-child + tr textarea.matrix-textarea").bind("destroyed",function(){

		self.refresh_cells(this);

	});

}
Entry_type_matrix_controller.prototype.unbind_destroy = function(){
	var self = this;

	$("tbody.matrix tr.matrix:first-child + tr textarea.matrix-textarea").unbind("destroyed");

}

var $cell_type_selects = $('tbody.matrix > tr:first-child select');
var entry_type_cell = false;

function entry_type_cell_type_exists(){
		
	var $entry_type_option = $('tbody.matrix > tr:first-child select option[value=entry_type]:selected');
	var number_of_entry_types = $entry_type_option.length;
	
	if(number_of_entry_types > 1){
		alert('Hold on, only one Entry Type Cell per Matrix Field');
	}else if(number_of_entry_types == 1){
		var etm_controller = new Entry_type_matrix_controller($entry_type_option);
		etm_controller.init();
	}

}

$cell_type_selects.live('change', function(){
	entry_type_cell_type_exists();
});

entry_type_cell_type_exists();














