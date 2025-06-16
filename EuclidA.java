import java.util.Scanner;
public class EuclidAlgorithm {
public static void main(System[]args){
    Scanner input= new Scanner(System.in);
    System.out.print("enter the value of m");
    int m=  input.nextInt();
    System.out.print("enter the value of n");
    int n=  input.nextInt();
  System.out.println(Euclid(m, n));
}
}
public static int Euclid(int m,int n){
    do{
     int r=m%n;
     if(r!=0){
        m=n;
        n=r;
     }while(n!=0);
    }
    return m;
}
