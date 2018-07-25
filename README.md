# ansua
Library to go to framework

# What is ansua?
ansua is a JavaScript library.

#What are the advantages of ansua?
You can easily create a dom using JavaScript.
The dom created by the data foundation can be easily assigned to variables.
Developers can work on future work without restrictions.
It is optimized for working with the server.

#Basic example of markup change

<div id="wrapper1">
		<table class="table">
			<colgroup>
				<col style="width: 50px;">
				<col>
				<col>
				<col>
				<col>
			</colgroup>
			<thead>
				<tr>
					<th>No</th>
					<th>Name</th>
					<th>CellPhone</th>
					<th>Date</th>
					<th>Remarks</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="center">1</td>
					<td>Lee Suk Kyu</td>
					<td>010-2784-2146</td>
					<td>1986.05.01</td>
					<td>A person who loves development</td>
				</tr>
				<tr>
					<td class="center">2</td>
					<td>BEI</td>
					<td>031-203-9759</td>
					<td>2017.12.26</td>
					<td>Lee Suk-Kyu's bar</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div id="wrapper2"></div>

	<script>
		var HEAD_DATA, ROW_DATA;
		var $thead, $tbody;
		var $temp;

		HEAD_DATA = [ 'No', 'Name', 'CellPhone', 'Date', 'Remarks' ];

		ROW_DATA = [ {
			name : 'Lee Suk Kyu',
			call : '010-2784-2146',
			date : '1986.05.01',
			remarks : 'A person who loves development'
		}, {
			name : 'BEI',
			call : '031-203-9759',
			date : '2017.12.26',
			remarks : 'Lee Suk-Kyu\'s bar'
		} ]

		$scene = ansua.dom('#wrapper2');

		// draw table bone

		$scene.insert(ansua.dom('<table class="table"></table>').insert(
				ansua.dom('<colgroup>').insert(
						ansua.dom('<col>').css('width', '50px')).insert(
						ansua.dom('<col>')).insert(ansua.dom('<col>')).insert(
						ansua.dom('<col>')).insert(ansua.dom('<col>'))).insert(
				$thead = ansua.dom('<thead></thead>')).insert(
				$tbody = ansua.dom('<tbody></tbody>')))

		// draw table head list
		$thead.insert($temp = ansua.dom('<tr></tr>'))

		for (i in HEAD_DATA) {
			$temp.insert(ansua.dom('<th>' + HEAD_DATA[i] + '</th>'))
		}

		// draw table body list
		for ( var i in ROW_DATA) {
			$tbody.insert($temp = ansua.dom('<tr><td class="center">'
					+ (+i + 1) + '</td></tr>'))
			for ( var j in ROW_DATA[i]) {
				$temp.insert(ansua.dom('<td>' + ROW_DATA[i][j] + '</td>')
						.event('click', function() {
							alert('click!');
							console.log(this);
						}))
			}
		}
	</script>
