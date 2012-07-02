/**
 * This class controls an individual matrix field that contains Entry Type cells. Each if there are multiple
 * Matrix fields, each with entry type cells, an instance will be created for each.
 * 
 * The main purpose of this class is to controll items related to the upkeep of the Matrix field as a whole.
 * Things like setting column headers, resizing each row, etc.
 */

var ETM_field_controller = function(table){
	var self = this;
	
	self.$table = $(table);
	self.$tbody = self.$table.find(">tbody");

	self.tbody_width = self.$tbody.width();
	
	//an empty array which will eventually hold the column titles for each column
	self.col_headings = [];
	self.col_widths = [];

}

ETM_field_controller.prototype.init = function(){
	var self = this;
	
	//lets save and remove the column headers
	self.set_col_headings();
}

/*
*	This method loops over a Matrix fields th elements and saves, then removes the th field.  At the moment it also
*	removes a row of tds, which hold extra data about the Matrix field.
*/
ETM_field_controller.prototype.set_col_headings = function(){

	var self = this;

	//loop over all of the matrix column headings
	self.$table.find(">thead > tr.matrix-first > th.matrix").each(function(){

		$el = $(this);
		if( $el.html() != "" ){
			self.col_headings.push($el.html());
			self.col_widths.push($el.attr('width'));	
		}
		$el.remove();
		
	});

	//loop over the additional tds in the header
	self.$table.find("> thead > tr.matrix-last > td.matrix").each(function(){

		$el = $(this);
		$el.remove();
		
	});

	self.$table.addClass('entry_type_matrix_init');

}

/**
 * Each time a row's entry type changes we need to loop over each row in the matrix and resize it according to how
 * many total fields are being displayed for that row.
 * 
 * @param  HTMLDOM el the entry type select that was changed
 */
ETM_field_controller.prototype.adjust_cell_sizes = function(el){
	var self = this;

	$el = $(el);
	var $tr = $el.parents("tr:eq(0)");
	var tr_height = $tr.height();

	//getting the total body width of the table
	var t_body_width = self.tbody_width;
	t_body_width = t_body_width - $tr.find(">th").outerWidth();

	//getting the number of visible cells so we can figure out how wide they each should be
	var $visible_cells = $tr.find(">td:visible");
	var $visible_cells_without_width_set = $tr.find(">td:visible:not([width])");
	
	var number_of_visible_cells_without_width_set = $visible_cells_without_width_set.length;
	var number_of_visble_cells_with_width_set = $tr.find('>td:visible[width]').length;

	var total_width_percentage = 0;
	$tr.find('>td:visible[width]').each(function(){
		var width = $(this).attr('width');
		total_width_percentage += Number(width.replace('%',''));
	});

	var total_percentage_width_in_pixels = ((total_width_percentage * .01) * t_body_width) + (21 * number_of_visble_cells_with_width_set);

	var cell_width = ((t_body_width - total_percentage_width_in_pixels) / number_of_visible_cells_without_width_set) - 21;

	$visible_cells.height(350);
	$visible_cells_without_width_set.width(cell_width);
	//$visible_cells.css("padding","7px 10px !important");

}




/**
 * This class controls functionality that occurs for each row in the Matrix field.  Each time a new row
 * is created inwith a Matrix Field with an entry type cell, a new ETM_row instance is instantiated.
 * @param Matrix.cell cell the data returned by the Martix fieldtype providng us with information about the cell.
 */
var ETM_row = function(cell){
	var self = this;
	
	self.matrix_cell_data = cell;

	//the <table> element for each Matrix field was given a data param so we can reference the ETM_field controller when a row
	//is instantiated.  This matrix_tables_index lets us know the location of that controller so we can give this ETM_row class
	//access to it.
	var matrix_tables_index = $(self.matrix_cell_data.dom['$td'][0]).parents('table.matrix(eq:0)').data("et_matrix_tables_index");
	self.ETM_field_controller = et_matrix_controllers[matrix_tables_index];

	self.$row = $(self.matrix_cell_data.row.dom["$tr"][0]);
}

/**
 * Init'ing events for the entry_type_matrix_dropdown and also calling a method that sets our headings inside each cell
 * @return {[type]}
 */
ETM_row.prototype.init = function(){
	var self = this;

	self.$row.find(".entry_type_matrix_dropdown").bind("change",function(){
	
		var cells_to_hide = $(this).find(":selected").attr("rel").split("|");
		self.turn_off_cells(this, cells_to_hide);
		self.ETM_field_controller.adjust_cell_sizes(this);
		
	});

	self.set_cell_headings();

}

/**
 * Loops over each cell in the row and sets the heading.  Aftewards its also triggers the change event so
 * the correct layout is displayed when the row loads.
 */
ETM_row.prototype.set_cell_headings = function(){
	var self = this;

	var row_entry_type_dropdown = false;

	$.each(self.matrix_cell_data.row.dom["$tds"], function(index, value){

		var $td = $(this);
		
		var col_label = self.matrix_cell_data.field.cols[index].label;

		//setting label
		$td.prepend("<label rel='"+index+"' class=\"entry_type_matrix_col_label\">"+col_label+"</label>");

		//setting width on td so we can keep the widths
		if(self.ETM_field_controller.col_widths[index] != ""){
			$td.attr('width', self.ETM_field_controller.col_widths[index]);	
		}
		

		if($td.find(".entry_type_matrix_dropdown").length){
			row_entry_type_dropdown = $td.find(".entry_type_matrix_dropdown");
		}

	});

	row_entry_type_dropdown.trigger("change");
}

/**
 * This is how we toggle on/off the cells when the entry_type_dropdown is changed.
 * @param  HTMLDOM el  the HTMLDOM element of the select dropdown
 * @param  array cols an array holding the indicies of the cells we want to hide
 */
ETM_row.prototype.turn_off_cells = function(el, cols){
	var self = this;

	//turn on all of the tds in the row momentarily
	self.$row.find(">td").css("display", "block").css("float","left");

	//turning off each individual column that we want to hide
	$.each(cols, function(index, value){
		
		self.$row.find(">td label[rel="+value+"]").parent().css("display", "none");

	});

}





//these are some global arrays that hold our Matrix table elements, and also each ETM_matrix_field_controller corresponding to
//each of the table elements in the et_matrix_tables array.  The reason for these is that we need access to each controller when
//a new row is created, so we have to setup this sort of key/value store to reference the controllers.
var et_matrix_tables = [];
var et_matrix_controllers = [];


/**
 * This runs each time a new Matrix entry_type cell is created.  It runs when the page loads with existing entries and
 * also when we create one after page load.
 * @param  Matrix.data cell the Matrix.data info the Matrix fieldtype provides for each cell
 */
Matrix.bind("entry_type", "display", function(cell){

	//check to see if this matrix field has been init'd yet.  if not lets instantiate a new row controller class
	//and get the process started
	var $parent_table = $(cell.dom['$td'][0]).parents('table.matrix(eq:0)');

	if(! $parent_table.hasClass("entry_type_matrix_init")){
		
		$parent_table.data("et_matrix_tables_index", et_matrix_tables.length + "");
		et_matrix_tables[""+et_matrix_tables.length] = $parent_table[0];

		//instantiating an controller for each field, and saying them into the global array for refernce later.
		var controller = new ETM_field_controller($parent_table[0]);
		controller.init();
		et_matrix_controllers[et_matrix_controllers.length + ""] = controller;
	}

	var row_entry_type_dropdown = false;

	var row = new ETM_row(cell);
	row.init();

});














