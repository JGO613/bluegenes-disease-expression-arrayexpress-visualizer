const query = geneId => ({
	name: 'GeneExpress',
	title:
		'Gene --> Gene Expression  (Tissue, Disease; Array Express, E-MTAB-62)',
	comment: 'Added 23AUG2011:ML',
	description:
		'Show expression for a gene or list of genes. Optionally constrain the P-value and the T-statistic.  The results can also be optionally filtered on organism part, cell type or disease state. Data source: The Gene Expression Atlas (http://www.ebi.ac.uk/gxa/).  Keywords:  Expression, Genes, Organism part, Disease state, Cell type, P value, T statistic.',
	constraintLogic: '((((C and B and A and F and D) and C) and C) and C) and C',
	from: 'Gene',
	select: [
		'symbol',
		'name',
		'organism.name',
		'atlasExpression.condition',
		'atlasExpression.type',
		'atlasExpression.tStatistic',
		'atlasExpression.pValue',
		'atlasExpression.expression'
	],
	orderBy: [
		{
			path: 'symbol',
			direction: 'ASC'
		}
	],
	where: [
		{
			path: 'Gene.id',
			op: '=',
			value: geneId,
			extraValue: 'H. sapiens',
			code: 'D',
			editable: true,
			switched: 'LOCKED',
			switchable: false
		},
		{
			path: 'atlasExpression.expression',
			op: '!=',
			value: 'NONDE'
		},
		{
			path: 'atlasExpression.type',
			op: '=',
			value: 'disease_state',
			code: 'B'
		}
	]
});

function queryData(geneId, serviceUrl, imjsClient = imjs) {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line
		const service = new imjsClient.Service({ root: serviceUrl });
		service
			.records(query(geneId))
			.then(data => {
				if (data && data.length) resolve(data[0]);
				else reject('No data found!');
			})
			.catch(() => reject('No data found!'));
	});
}

export default queryData;
