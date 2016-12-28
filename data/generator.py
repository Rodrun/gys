"""
Assists in generating JSON files for Guess Your Sneaker.
"""
import os

NAME_NAME = "name"
IMAGE_NAME = "img"


def ask_yn(question, m=1, default="y"):
    """
    Ask a '[y/n]' question.
    :param question: Question.
    :param m: Maximum number of attempts
    :param default: Default response.
    :return: 'y' or 'n', depending on user response.
    """
    if default != "y" and default != "n":
        return "n"
    if m < 1:
        return default

    attempt = 0
    while attempt < m:
        res = input("{} [y/n]: ".format(question))
        if res != "y" and res != "n":
            attempt += 1
            continue
        else:
            return res

    return default


def create_file(dname, name, shoename, imgval):
    """
    Create a new file.
    :param dname: Directory.
    :param shoename: Name of the shoe.
    :param imgval: URL of the shoe image.
    :param name: Name of file.
    :return: Nothing.
    """
    file = open(dname + os.path.sep + name + ".json", "w+")
    file.write("{\"" + NAME_NAME + "\":\"" + shoename + "\",\"" + IMAGE_NAME + "\":\"" + imgval + "\"}")
    file.close()


directory = input("Target directory: ")
initNumber = int(input("Starting number: "))
useRelease = True if ask_yn("Use releases?") == "y" else False
release = ""
# Number of times the loop has passed, in order to add to initNumber to get the correct current file no.
numberOffset = 0

# Ctrl + C to exit
while True:
    currentNumber = int(initNumber + numberOffset)
    print("### WRITING FOR {}".format(currentNumber))
    shoe = input("Shoe name: ")
    release = ""
    if useRelease:
        release = shoe.split()[0]

    img = input("Image URL: ")
    create_file("{}{}{}".format(directory, os.path.sep, release), str(initNumber + numberOffset),
                shoe.replace("\"", "\\\""), img)
    numberOffset += 1
