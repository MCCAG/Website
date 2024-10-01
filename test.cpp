#include <vector>
#include <iostream>

using namespace std;

int passwords[8][5] = {};

int main() {
    int number;
    cin >> number;
    for (int index = 0; index < number; index ++)
        for (int other = 0; other < 5; other ++)
            cin >> passwords[index][other];
    
    return 0;
}
