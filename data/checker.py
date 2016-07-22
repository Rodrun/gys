"""
Check if a shoe exists for Guess Your Sneaker.
"""
import os

def open_read(path):
    """
    Open a file and read its contents.
    :param path: Path to the file.
    :return: File contents.
    """
    file = open(path)
    r = file.read()
    file.close()
    return r


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


directory = input("Root directory: ")
hasVersions = True if ask_yn("Has releases?") == "y" else False
release = -1

while True:
    if hasVersions:
        release = input("Release #: ")

    name = input("Name: ")
    fCount = 1
    while True:
        path = "{r}{s}{v}{s}{n}.json".format(r=directory, s=os.path.sep, v=release if release != -1 else "", n=fCount)
        if os.path.isfile(path):
            cont = open_read(path)
            if cont.find(name) != -1:
                print("FOUND IN {}.json".format(fCount))
        else:
            print("NOTE Number {} doesn't exist, stopping check here.".format(fCount))
            break

        fCount += 1

