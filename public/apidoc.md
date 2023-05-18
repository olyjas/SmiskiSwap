## Sonny Angel API Documentation
The Sonny Angel API provides information about all of the Sonny Angels that are in the market as well as the series they belong to.

## Looking up all of the Sonny Angels
**Request Format:**  /allangels

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Returns a list of all the sonny angels that are available to the market and are in the API

**Example Request:** /allangels

**Example Response:**
```text
{
Garlic
Zucchini
Onion
Tomato
..
}
```

**Error Handling:**
N/A

## Looking up all of the Sonny Angels Series
**Request Format:** /angelseries

**Request Type:** GET

**Returned Data Format**: TEXT

**Description:** This will return all of the series that Sonny Angel has

**Example Request:**  /angelseries

**Example Response:**
*Fill in example response in the {}*

```text
{
  Vegetable
  Fruit
  Flower
  Marine
…

}
```

**Error Handling:**
N/A

## Looking up all the Sonny Angels within a series

**Request Format:** /series

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** The user will get a detailed list of all the series with an array of all the Sonny
Angels within the series

**Example Request:**  /series/all

**Example Response:**
*Fill in example response in the {}*

```json
{
  Vegetable: [ Garlic,
	      Onion,
	      Tomato,
	      …. ]
  Flower: [ Rose,
	      Tulip,
	      … ]
…
}
```

**Error Handling:**
N/A

## Looking up specific information about each Sonny

**Request Format:**  /<name>

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** The user will get a detailed list of all relevant information about a specific sonny

**Example Request:**  /cauliflower

**Example Response:**

```json
{
  Name: cauliflower
	series: vegetable
	Image: /cauliflowersonny.png
…
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
 - If passed in an invalid Sonny Angel, returns an error with the message: `NO RESULTS FOUND: {name} is not a valid Sonny Angel”
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, an error with the message: “Something went wrong. Please try again later.” will be returned






