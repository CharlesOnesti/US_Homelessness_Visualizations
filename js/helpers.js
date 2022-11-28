// credit: https://gist.github.com/calebgrove/c285a9510948b633aa47
const TO_NAME = 1;
const TO_ABBREVIATED = 2;

function convertRegion(input, to) {
    let states = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['American Samoa', 'AS'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['Armed Forces Americas', 'AA'],
        ['Armed Forces Europe', 'AE'],
        ['Armed Forces Pacific', 'AP'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District Of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Guam', 'GU'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Marshall Islands', 'MH'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Northern Mariana Islands', 'NP'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Puerto Rico', 'PR'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['US Virgin Islands', 'VI'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    // So happy that Canada and the US have distinct abbreviations
    let provinces = [
        ['Alberta', 'AB'],
        ['British Columbia', 'BC'],
        ['Manitoba', 'MB'],
        ['New Brunswick', 'NB'],
        ['Newfoundland', 'NF'],
        ['Northwest Territory', 'NT'],
        ['Nova Scotia', 'NS'],
        ['Nunavut', 'NU'],
        ['Ontario', 'ON'],
        ['Prince Edward Island', 'PE'],
        ['Quebec', 'QC'],
        ['Saskatchewan', 'SK'],
        ['Yukon', 'YT'],
    ];

    let regions = states.concat(provinces);

    let i; // Reusable loop variable
    if (to == TO_ABBREVIATED) {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < regions.length; i++) {
            if (regions[i][0] == input) {
                return (regions[i][1]);
            }
        }
    } else if (to == TO_NAME) {
        // input = input.toUpperCase();
        for (i = 0; i < regions.length; i++) {
            if (regions[i][1] == input) {
                return (regions[i][0]);
            }
        }
    }
}

const radarData = [
    {
        'name': 'District of Columbia',
        'Shelter Capacity': 6272,
        'Housing Burden': 29.5,
        'Homeless per 10,000': 90.4,
        'Aid Spending': 150,
        'Population': 0.71
    },
    {
        'name': 'New York',
        'Shelter Capacity': 83720,
        'Housing Burden': 31.6,
        'Homeless per 10,000': 46.9,
        'Aid Spending': 3000,
        'Population': 8.47
    },
    {
        'name': 'Hawaii',
        'Shelter Capacity': 3312,
        'Housing Burden': 32,
        'Homeless per 10,000': 45.6,
        'Aid Spending': 50,
        'Population': 1.44
    },
    {
        'name': 'California',
        'Shelter Capacity': 60582,
        'Housing Burden': 34,
        'Homeless per 10,000': 40.9,
        'Aid Spending': 7200,
        'Population': 39.24
    },
    {
        'name': 'Oregon',
        'Shelter Capacity': 5315,
        'Housing Burden': 30.8,
        'Homeless per 10,000': 34.7,
        'Aid Spending': 2300,
        'Population': 4.25
    },
]

let policyEvents = [
	{
		'name': 'Mayors Challenge to End Veteran Homelessness',
		'date': new Date(2015, 5)
	},
	{
		'name': 'Increased SNAP Funding',
		'date': new Date(2013, 3)
	},
	{
		'name': 'Housing Voucher Increase',
		'date': new Date(2018, 0)
	},
	{
		'name': 'The Homeless Emergency Assistance and Rapid Transition to Housing',
		'date': new Date(2009, 4)
	},
    {
        'name': 'USICH Opening Doors: The Federal Strategic Plan to Prevent and End Homelessness',
        'date': new Date(2010, 5)
    }
]