"""
Assists in generating JSON files for Guess Your Sneaker.
"""

NAME_NAME = "name"
IMAGE_NAME = "img"


def create_file(dname, name, shoename, imgval):
    """
    Create a new file.
    :param dname: Directory.
    :param shoename: Name of the shoe.
    :param imgval: URL of the shoe image.
    :param name: Name of file.
    :return: Nothing.
    """
    file = open(dname + name + ".json", "w+")
    file.write("{\"" + NAME_NAME + "\":\"" + shoename + "\",\"" + IMAGE_NAME + "\":\"" + imgval + "\"}")
    file.close();


directory = input("Target directory: ")
initNumber = int(input("Starting number: "))
# Number of times the loop has passed, in order to add to initNumber to get the correct current file no.
numberOffset = 0

# Ctrl + C to exit
while True:
    currentNumber = int(initNumber + numberOffset)
    print("### WRITING FOR {}".format(currentNumber))
    shoe = input("Shoe name: ")
    img = input("Image URL: ")
    create_file(directory, str(initNumber + numberOffset), shoe.replace("\"", "\\\""), img)
    numberOffset += 1
