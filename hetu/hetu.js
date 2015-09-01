//
//

// ---------------------------------------------------------------------------------------
// On page load

$(document).ready(initialize);

function initialize()
{
    for (i = 1; i < 4; i++)
    {
        $("#example" + i).click(function(){ $("#verification_hetu1").val($(this).text()); verify(); });
    }

    $("#verification_verify").click(verify);
    $("#verification_clear").click(clearVerification);

    $("#generation_birthday").datepicker({ minDate: new Date(1900, 0, 1), maxDate: new Date(2099, 11, 31), changeMonth: true, changeYear: true }).datepicker("setDate", new Date());

    $("#generation_generate").click(generate);
    $("#generation_clear").click(clearGeneration);
}

// ---------------------------------------------------------------------------------------
// Verification

function verify()
{
    hetu = $("#verification_hetu1").val().toUpperCase();

    $("#verification_hetu2").text(hetu);
    $("#verification_valid").hide();
    $("#verification_invalid").hide();
    $("#verified").show();
    
	if (hetu.length != 11)
	{
        showVerificationError("text must be 11 characters long");
        return;
	}

 	separator = hetu.substring(6, 7);
	if ((separator != '-') && (separator != 'A') && (separator != '+'))
	{
        showVerificationError("7th character must be +, -, or A");
        return;
	}

	for (i = 0; i < 10; i++)
	{
		if ((i != 6) && (!isDigit(hetu.substring(i, i + 1))))
		{
            showVerificationError(formatOrdinalNumber("{0} character must be a digit", i + 1));
			return;
		}
	}

	checksum1 = hetu.substring(10, 11);
    checksum2 = generateChecksum(hetu);
	if (checksum1 != checksum2)
	{
        showVerificationError("wrong checksum");
        return;
    }

    code = hetu.substring(9, 10);
    $("#verification_sex").text(isEven(code) ? "woman" : "man");
    
    birthday = new Date(("-" == separator ? "19" : ("+" == separator ? "18" : "20")) + hetu.substring(4, 6) + "-" + hetu.substring(2, 4) + "-" + hetu.substring(0, 2));
    $("#verification_birthday").text(birthday.toDateString());
    
    $("#verification_valid").show();
}

function showVerificationError(message)
{
    $("#verification_error").text(message);
    $("#verification_invalid").show();
}

function clearVerification()
{
    $("#verified").hide();
    $("#verification_hetu1").val("");
}

// ---------------------------------------------------------------------------------------
// Generation

function generate()
{
    birthday = $("#generation_birthday").datepicker("getDate");
    sex = $("#generation_sex").val();
    
    if (null == birthday)
    {
        showGenerationError("Invalid date.");
        return;
    }
    
    year = birthday.getFullYear();
    if ((year < 1800) || (year > 2099))
    {
        showGenerationError("Year of birthday must not be less than 1900 and greater than 2099.");
        return;
    }
    
    hetu = formatNumber(birthday.getDate(), 2) + formatNumber(birthday.getMonth() + 1, 2) + formatNumber(year % 100, 2);
    
    switch (Math.floor(year / 100))
    {
        case 18:
            hetu += "+";
            break;
        case 19:
            hetu += "-";
            break;
        case 20:
            hetu += "A";
            break;
    }
    
    random = Math.floor(Math.random() * 1000) + 1;
    if ((("F" == sex) && isOdd(random)) || (("M" == sex) && isEven(random)))
    {
        random++;
    }
    random %= 1000;
    if (0 == random)
    {
        random = 500;
    }
    hetu += formatNumber(random, 3);
    
    hetu += generateChecksum(hetu);

    $("#generation_hetu").text(hetu);
    $("#generation_result").show();

    $("#verification_hetu1").val(hetu);
    verify();
}

function showGenerationError(message)
{
    $("#generation_error").text(message);
    $("#generation_error").show();
}

function clearGeneration()
{
    birthday = $("#generation_birthday").datepicker("setDate", new Date());
    $("#generation_sex").val("F");
    $("#generation_error").hide();
    $("#generation_result").hide();
}

// ---------------------------------------------------------------------------------------
// Common functions

function generateChecksum(hetu)
{
	index = parseInt(hetu.substring(0, 6) + hetu.substring(7, 10), 10) % 31;
    
    return '0123456789ABCDEFHJKLMNPRSTUVWXY'.substring(index, index + 1);
}

// ---------------------------------------------------------------------------------------
// Generic functions

// Returns true if character is a digit; returns false otherwise.
function isDigit(character)
{
    return (1 == character.length) && (!isNaN(parseInt(character), 10));
}

// Returns true if number is even; returns false otherwise.
function isEven(number)
{
    return 0 == (number % 2);
}

// Returns true if number is odd; returns false otherwise.
function isOdd(number)
{
    return 1 == (Math.abs(number) % 2);
}

// Replaces all "{0}" placeholders with ordinal number together with suffix.
// E.g. formatOrdinalNumber("Ranked {0} among schoolmates", 3) returns "Ranked 3rd among schoolmates" string.
function formatOrdinalNumber(format, number)
{
    return format.replace("{0}", number.toString() + getOrdinalNumberSuffix(number));
}

// Returns ordinal number suffix.
// E.g. "st" for 1, "nd" for 2, "rd" for 3, "th" for 4 and so on.
function getOrdinalNumberSuffix(number)
{
    if (Math.floor((number % 100 / 10)) != 1)
    {
        switch (number % 10) 
        {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
        }
    }
    
    return "th";
}

// Converts number to string and pads it with leading zeroes if needed.
function formatNumber(number, length)
{
    return (Array(length + 1).join("0") + number).slice(-length);
}
